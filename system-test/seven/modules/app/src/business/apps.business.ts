import { Injectable } from 'providerjs';
import { Assert, Session, ILoaderResponse, ILoaderRequest, ObjectId } from '@seven/framework';
import { AppDatabase } from '../dataaccess/app.database';
import { AppInstanceEntity } from '../entity';
import { BusinessEvent } from '@seven/core';

@Injectable()
export class AppsBusiness {

    public constructor(
        private app: AppDatabase,
        private session: Session
    ) {
    }

    @BusinessEvent()
    public async appsView(request: ILoaderRequest) {
        const prototypeAccess = await this.app.prototype;
        return await prototypeAccess.appsView(request, this.session.profileId);
    }

    @BusinessEvent()
    public async install(prototypeId: string): Promise<void> {
        
        const objPrototypeId = new ObjectId(prototypeId);

        const instanceAccess = await this.app.instance;
        const installed = await instanceAccess.getInstalled(objPrototypeId, this.session.profileId);
        Assert.mustNull(installed, 'App já está instalado!');

        const appInstall = <AppInstanceEntity>{
            _id: <any>undefined,
            prototypeId: objPrototypeId,
            profileId: this.session.profileId
        }
        const createResult = await instanceAccess.insertOne(appInstall);
        Assert.database.insertedOne(createResult, 'Error installing the app!');

        const prototypeAccess = await this.app.prototype;
        await prototypeAccess.updateUsage(objPrototypeId);
    }

    public async checkAndSetInstance(code: number): Promise<boolean> {

        let appInstanceId = this.session.appInstanceId[code];

        if (!appInstanceId) {
            const instanceAccess = await this.app.instance;
            const installed = await instanceAccess.getInstalledByCode(code, this.session.profileId);
            if (installed) {
                appInstanceId = installed._id;
            }
            else {
                appInstanceId = 'false';
            }
            this.session.appInstanceId[code] = appInstanceId;
        }

        if (appInstanceId === 'false') {
            return false;
        }
        else {
            return true;
        }
    }

    @BusinessEvent()
    public async getInstanceIdByCode(profileId: ObjectId, code: number): Promise<AppInstanceEntity> {
        const instanceAccess = await this.app.instance;
        const appInstance = await instanceAccess.getInstalledByCode(code, profileId);
        Assert.mustNotNull(appInstance, 'Aplication não está instalado!');
        return appInstance;
    }
}