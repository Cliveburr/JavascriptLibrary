import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';
import { NotifyType, ITextInput, ValueFormatedType, INumberInput, IDatetimeInput, FilterItemType, ILiCollectionInput, ILoaderFilterType,
    ILiCollectionSelectModalInput, IFormated, RelationProfileModel, ICollectionItem, SaleFormCommissionModel, SaleFormCommissionedModel, SaleFormModel,
    SaleStatus } from '@seven/webshared';
import { ProfileService } from 'app/core';
import { GenericResolver, IGenericResolverData, IModelIdResolverData, ModelIdResolver } from 'app/framework';
import { SaleService } from '../../service';

export interface SaleFormMeta {
    alias: ITextInput;
    value: INumberInput;
    data: IDatetimeInput;
    commissioned: ILiCollectionSelectModalInput<SaleFormCommissionedModel, RelationProfileModel>;
    commissions: ILiCollectionInput<SaleFormCommissionModel>;
    commissionsMeta: {
        value: INumberInput;
        date: ITextInput;
        status: IFormated;
    }
}

@Component({
    templateUrl: 'sale-form.component.html',
    styleUrls: ['temp-custom.scss']
})
export class SaleFormComponent {

    public model: SaleFormModel;
    public meta: SaleFormMeta;
    public commissionsSelected?: ICollectionItem<SaleFormCommissionModel>[];
    private formGroup: FormGroup;

    public constructor(
        private saleService: SaleService,
        private profileService: ProfileService,
        public route: ActivatedRoute
    ) {
        this.formGroup = new FormGroup({});
        const commissionedGroup = new FormGroup({});
        const commissionsGroup = new FormGroup({});

        this.meta = {
            alias: {
                label: 'Descritivo',
                placeholder: 'Entre com o descritivo dessa venda',
                class: 'col-6',
                formGroup: this.formGroup,
                validators: [ 'required' ]
            },
            value: {
                label: 'Valor',
                placeholder: 'Valor da venda',
                class: 'col-4',
                money: true,
                formGroup: this.formGroup,
                validators: [ { key: 'required', message: 'Entre com o valor da venda!' } ]
            },
            data: {
                label: 'Data',
                placeholder: 'Data da venda',
                class: 'col-2',
                todayButton: true,
                formGroup: this.formGroup,
                validators: [ { validator: Validators.required, key: 'required', message: 'precisa ter uma data!' } ]
            },
            commissioned: {
                onAddItem: this.commissioned_addItem.bind(this),
                selectMode: true,
                modal: {
                    modalTitle: 'Selecione o comissionado',
                    collection: {
                        apiItems: this.profileService.call.relationProfileSelect,
                        displayProp: 'name',
                        filter: {
                            filters: [
                                { type: FilterItemType.automatic, loader: { type: ILoaderFilterType.ContainsObjectId, property: '_id', inverse: true }, onRequest: this.commissionedNameFilter.bind(this) },
                                { type: FilterItemType.text, loader: { type: ILoaderFilterType.Regex, property: 'name', regexPattern: '{{value}}', regexFlags: 'i' } }
                            ]
                        }
                    }
                },
                formGroup: this.formGroup,
                selectGroup: commissionedGroup,
                validators: [ 'collectionRequiredAny' ]
            },
            commissions: {
                onAddItem: this.comissions_addItem.bind(this),
                onEditItem: () => {},
                formGroup: commissionedGroup,
                editGroup: commissionsGroup,
                validators: [ 'collectionRequiredAny' ]
            },
            commissionsMeta: {
                value: {
                    label: 'Valor',
                    placeholder: 'Entre com o valor da comissão',
                    class: 'col-6',
                    money: true,
                    formGroup: commissionsGroup,
                    validators: [ 'required' ]
                },
                date: {
                    label: 'Vencimento',
                    placeholder: 'Entre com a data de vencimento',
                    class: 'col-6',
                    formGroup: commissionsGroup,
                    validators: [ 'required' ]
                },
                status: {
                    format: { type: ValueFormatedType.enum, enumType: SaleStatus }
                }
            }
        }
        this.model = route.snapshot.data.model;
    }

    private commissioned_addItem(selected: RelationProfileModel): SaleFormCommissionedModel {
        return {
            relation: selected,
            commissions: []
        }
    }

    private comissions_addItem(): SaleFormCommissionModel {
        return <any>{
            status: SaleStatus.Open
        }
    }

    private commissionedNameFilter(): any {
        return this.model.commissioned
            .map(c => c.value!.relation!._id);
    }

    public setlectComissioned(event: ICollectionItem<SaleFormCommissionedModel>): void {
        this.commissionsSelected = event?.value?.commissions;
    }

    public async save_onclick(): Promise<void> {

        this.formGroup.markAllAsTouched();
        if (this.formGroup.invalid) {
            this.saleService.base.notify.addNotify(NotifyType.AlertWarning, 'Preencha todos campos requeridos antes!');
            return;
        }

        await this.saleService.call.salesSave(this.route.snapshot.params['nickName'], this.model);
        this.saleService.base.router.navigate(['../../../sales'], { relativeTo: this.route });
    }

    public back_click(): void {
        this.saleService.base.router.navigate(['../../../sales'], { relativeTo: this.route });
    }
}

export const SaleFormPath = <Route>{
    path: 'sale/form/:id',
    component: SaleFormComponent,
    resolve: { model: GenericResolver },
    data: <IGenericResolverData>{
        params: ['nickName', 'id'],
        services: [SaleService],
        getMethod: data => {
            const nickName = data.params[0];
            const id = data.params[1];
            const saleService = data.services[0] as SaleService;
            return saleService.call.getSalesForm(nickName, id);
        }
    }
}