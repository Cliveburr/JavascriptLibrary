import { Injectable } from 'providerjs';
import { Assert, Session, ILoaderResponse, ILoaderRequest, ObjectId, ICollectionItem, CollectionItemStatus, SevenError } from '@seven/framework';
import { CommissionControlDatabase } from '../dataaccess/commission-control.database';
import { AppBusinessClass } from './app-business-handler.interception';
import { AppsBusiness, AppsEnum } from '@seven/app';
import { SaleFormModel, SalesCommissionedModel, SalesModel } from '../model';
import { CommissionEntity, SaleEntity, SaleStatus } from '../entity';
import { ProfileBusiness, BusinessEvent } from '@seven/core';
// import { AppPrototypeModel } from '../model';
// import { AppInstanceEntity } from '../entity';

@Injectable()
@AppBusinessClass()
export class SaleBusiness {

    public constructor(
        private comm: CommissionControlDatabase,
        private profileBusiness: ProfileBusiness,
        private appBusiness: AppsBusiness,
        private session: Session
    ) {
    }

    // private getAppInstanceId(): ObjectId {
    //     return <ObjectId>this.session.appInstanceId[AppsEnum.CommissionControl];
    // }

    @BusinessEvent()
    public async getSalesModel(nickName: string): Promise<SalesModel> {

        // criar sistema de cache para agiliziar todo esses gets
        // pegar o profileId do nickName
        const profileId = await this.profileBusiness.getByNickName(nickName)

        // pegar o appInstanceId
        const appInsntance = await this.appBusiness.getInstanceIdByCode(profileId._id, AppsEnum.CommissionControl);

        return {};
    }

    @BusinessEvent()
    public async loaderSales(request: ILoaderRequest) {

        // criar sistema de cache para agiliziar todo esses gets
        // pegar o profileId do nickName
        const profileId = await this.profileBusiness.getByNickName('request.nickName')

        // pegar o appInstanceId
        const appInsntance = await this.appBusiness.getInstanceIdByCode(profileId._id, AppsEnum.CommissionControl);

        const saleAccess = await this.comm.sale;
        //const appInstanceId = this.getAppInstanceId();
        return await saleAccess.loaderSales(request, appInsntance._id);
    }

    // @BusinessEvent()
    // public async install(prototypeId: string): Promise<void> {
        
    //     const objPrototypeId = new ObjectId(prototypeId);

    //     const instanceAccess = await this.app.instance;
    //     const installed = await instanceAccess.getInstalled(objPrototypeId, this.session.profileId);
    //     Assert.mustNull(installed, 'App já está instalado!');

    //     const appInstall = <AppInstanceEntity>{
    //         _id: <any>undefined,
    //         prototypeId: objPrototypeId,
    //         profileId: this.session.profileId
    //     }
    //     const createResult = await instanceAccess.create(appInstall);
    //     Assert.database.insertedOne(createResult, 'Error installing the app!');

    //     const prototypeAccess = await this.app.prototype;
    //     await prototypeAccess.updateUsage(objPrototypeId);
    // }

    
    @BusinessEvent()
    public async salesSave(nickName: string, request: SaleFormModel): Promise<void> {

        // criar sistema de cache para agiliziar todo esses gets
        // pegar o profileId do nickName
        const profileId = await this.profileBusiness.getByNickName(nickName)

        // pegar o appInstanceId
        const appInsntance = await this.appBusiness.getInstanceIdByCode(profileId._id, AppsEnum.CommissionControl);


        const saleAccess = await this.comm.sale;
        const commission = await this.comm.commission;

        // veriicar se todas datas estão a frente da data da venda

        //const appInstanceId = this.getAppInstanceId();

        // iniciar transação

        const sale = <SaleEntity>{
            _id: request._id ? new ObjectId(request._id) : request._id,
            appInstanceId: appInsntance._id,
            alias: request.alias,
            total: request.total,
            createdDatetime: new Date(request.date)
        }

        if (sale._id) {
            // const updateResult = await saleAccess.updateMany .updateByQuery({
            //     _id: sale._id,
            //     appInstanceId: sale.appInstanceId
            // }, sale);
            // Assert.database.updatedOne(updateResult, 'Invalid sales to save!');
        }
        else {
            const insertResult = await saleAccess.insertOne(sale);
            Assert.database.insertedOne(insertResult, 'Invalid sales to save!');
        }

        const allCommissions = this.prepareCommissions(sale._id, request.commissioned);
        const commissionsSplited = this.splitCollection(allCommissions);

        if (commissionsSplited.create.length > 0) {
            const createResult = await commission.insertMany(...commissionsSplited.create);
            Assert.database.insertedMany(createResult, commissionsSplited.create.length, 'Invalid sales to save!');
        }

        if (commissionsSplited.update.length > 0) {
            // const updateResult = await commission.replace(...commissionsSplited.update);
            // Assert.database.replace(updateResult, commissionsSplited.update.length, 'Invalid sales to save!');
        }

        if (commissionsSplited.remove.length > 0) {
            const ids = commissionsSplited.remove
                .map(e => e._id);
            // const deleteResult = await commission.deleteByQuery({
            //     _id: {
            //         $in: ids
            //     },
            //     saleId: sale._id
            // });
            // Assert.database.delete(deleteResult, commissionsSplited.remove.length, 'Invalid sales to save!');
        }

        // commitar transação

        // chamar evento para atualizar a tabela commissioned
    }

    private prepareCommissions(saleId: ObjectId, commissioned: ICollectionItem<SalesCommissionedModel>[]): ICollectionItem<CommissionEntity>[] {

        const allCommissions: ICollectionItem<CommissionEntity>[] = [];
        const commissionedSplited = this.splitCollection(commissioned);

        for (const commissioned of commissionedSplited.create) {
            const commissionedId = new ObjectId(commissioned.relation._id);
            for (const commissionsItem of commissioned.commissions) {
                const commissionReq = commissionsItem.value!;
                allCommissions.push({
                    status: CollectionItemStatus.create,
                    value: {
                        _id: <any>undefined,
                        saleId: saleId,
                        relationId: commissionedId,
                        total: commissionReq.value,
                        expirationDatetime: new Date(commissionReq.date),
                        status: SaleStatus.Open
                    }
                })
            }
        }

        const pristineAndUpdate = commissionedSplited.pristine.concat(commissionedSplited.update);
        for (const commissioned of pristineAndUpdate) {
            const commissionedId = new ObjectId(commissioned.relation._id);
            const commissionsSplited = this.splitCollection(commissioned.commissions);
            for (const commissionReq of commissionsSplited.create) {
                allCommissions.push({
                    status: CollectionItemStatus.create,
                    value: {
                        _id: <any>undefined,
                        saleId: saleId,
                        relationId: commissionedId,
                        total: commissionReq.value,
                        expirationDatetime: new Date(commissionReq.date),
                        status: SaleStatus.Open
                    }
                })
            }
            //const commissionsPristineAndUpdate = commissionsSplited.pristine.concat(commissionsSplited.update);
            for (const commissionReq of commissionsSplited.update) {
                allCommissions.push({
                    status: CollectionItemStatus.update,
                    value: {
                        _id: new ObjectId(commissionReq._id),
                        saleId: saleId,
                        relationId: commissionedId,
                        total: commissionReq.value,
                        expirationDatetime: new Date(commissionReq.date),
                        status: commissionReq.status
                    }
                })
            }
            for (const commissionReq of commissionsSplited.remove) {
                allCommissions.push({
                    status: CollectionItemStatus.remove,
                    value: <any>{
                        _id: new ObjectId(commissionReq._id),
                        saleId: saleId
                    }
                })
            }
        }

        for (const commissioned of commissionedSplited.remove) {
            for (const commissionsItem of commissioned.commissions) {
                const commissionReq = commissionsItem.value!;
                allCommissions.push({
                    status: CollectionItemStatus.remove,
                    value: <any>{
                        _id: new ObjectId(commissionReq._id),
                        saleId: saleId
                    }
                })
            }
        }

        return allCommissions;
    }

    private splitCollection<T>(list: ICollectionItem<T>[]): {
        pristine: T[],
        create: T[],
        update: T[],
        remove: T[]
    } {
        const splited = {
            pristine: <T[]>[],
            create: <T[]>[],
            update: <T[]>[],
            remove: <T[]>[]
        }
        for (const item of list) {
            if (item.value) {
                switch (item.status) {
                    case CollectionItemStatus.create:
                        splited.create.push(item.value);
                        break;
                    case CollectionItemStatus.update:
                        splited.update.push(item.value);
                        break;
                    case CollectionItemStatus.remove:
                        splited.remove.push(item.value);
                        break;
                    case CollectionItemStatus.pristine:
                    default:
                        splited.pristine.push(item.value);
                        break;
                }
            }
        }
        return splited;
    }

    @BusinessEvent()
    public async getSalesForm(nickName: string, id: string): Promise<SaleFormModel> { 
        
        // criar sistema de cache para agiliziar todo esses gets
        // pegar o profileId do nickName
        const profileId = await this.profileBusiness.getByNickName(nickName)

        // pegar o appInstanceId
        const appInsntance = await this.appBusiness.getInstanceIdByCode(profileId._id, AppsEnum.CommissionControl);

        if (id == 'create') {
            return <any>{
                commissioned: []
            };
        }

        const saleAccess = await this.comm.sale;
        //const appInstanceId = this.getAppInstanceId();

        const sale = await saleAccess.findOne({
            _id:  new ObjectId(id),
            appInstanceId: appInsntance._id
        });
        Assert.mustNotNull(sale, 'Invalid sale!');

        const commissionAccess = await this.comm.commission;

        const allCommissions = await (await commissionAccess.find({ saleId: sale._id })).toArray();
        const commissionedIds = this.distinctObjectId(allCommissions
            .map(c => c.relationId));
        //const commissioneds = await this.profileBusiness.getRelationProfileModel(profileId._id, commissionedIds);

        const response = <any>1; //<SaleFormModel>{
        //     _id: sale._id.toHexString(),
        //     alias: sale.alias,
        //     date: sale.createdDatetime,
        //     total: sale.total,
        //     commissioned: commissioneds.map(c => {
        //         return {
        //             value: {
        //                 relation: c,
        //                 commissions: allCommissions
        //                     .filter(ac => ac.relationId.equals(c._id))
        //                     .map(ac => { return {
        //                         value: {
        //                             _id: ac._id.toHexString(),
        //                             value: ac.total,
        //                             date: ac.expirationDatetime,
        //                             status: ac.status
        //                         }
        //                     }})
        //             }
        //         }
        //     })
        // }

        return response;
    }

    private distinctObjectId(list: ObjectId[]): ObjectId[] {
        const checkList: string[] = [];
        return list.reduce((result, item) => {
            const id = item.toHexString();
            if (checkList.indexOf(id) == -1) {
                checkList.push(id);
                result.push(item);
            }
            return result;
        }, <ObjectId[]>[]);
    }

    private distinct<T>(list: T[]): T[] {
        return list.reduce((result, item) => {
            if (result.indexOf(item) == -1) {
                result.push(item);
            }
            return result;
        }, <T[]>[]);
    }

    private groupBy<T>(list: T[], prop: string): { [key: string]: T[] } {
        return list.reduce((result, item) => {
            const key = (<any>item)[prop];
            (result[key] ||= []).push(item);
            return result;
        }, <any>{});
    }

    @BusinessEvent()
    public async salesDelete(nickName: string, ids: string[]): Promise<void> {

        const objsIds = ids
            .map(i => new ObjectId(i));

        let errors = '';
        for (const objId of objsIds) {
            try {
                this.saleDelete(nickName, objId);
            }
            catch (error) {
                errors += error.toString();
            }
        }
        if (errors != '') {
            throw new SevenError(errors);
        }
    }

    private async saleDelete(nickName: string, id: ObjectId): Promise<void> {

        // criar sistema de cache para agiliziar todo esses gets
        // pegar o profileId do nickName
        const profileId = await this.profileBusiness.getByNickName(nickName)

        // pegar o appInstanceId
        const appInsntance = await this.appBusiness.getInstanceIdByCode(profileId._id, AppsEnum.CommissionControl);

        const saleAccess = await this.comm.sale;
        //const appInstanceId = this.getAppInstanceId();

        const sale = await saleAccess.findOne({
            _id:  id,
            appInstanceId: appInsntance._id
        });
        Assert.mustNotNull(sale, 'Invalid sale!');

        const commissionAccess = await this.comm.commission;
        const allCommissions = await (await commissionAccess.find({ saleId: sale._id })).toArray();

        const anyCommissionDifferOfOpen = allCommissions
            .some(c => c.status != SaleStatus.Open);
        if (anyCommissionDifferOfOpen) {
            throw `Alias: ${sale.alias} tem comissão efetuada!`;
        }

        const commissionsIds = allCommissions
            .map(c => c._id);
        const commissionsDeleteResult = await commissionAccess.deleteMany({
            _id: {
                $in: commissionsIds
            },
            saleId: sale._id
        });
        Assert.database.delete(commissionsDeleteResult, commissionsIds.length, 'Invalid sales to delete!');

        const saleDeleteResult = await saleAccess.deleteMany({
            _id:  id,
            appInstanceId: appInsntance._id
        });
        Assert.database.delete(saleDeleteResult, 1, 'Invalid sales to delete!');

        // chamar evento para atualizar a tabela commissioned
    }
}