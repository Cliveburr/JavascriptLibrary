import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { ActiveButtonType, ITableData, SalesModel, ValueFormatedType } from '@seven/webshared';
import { GenericResolver, IGenericResolverData, TableCollectionComponent } from 'app/framework';
import { SaleService } from '../../service';

@Component({
    templateUrl: './sale.component.html'
})
export class SaleComponent {

    public model: SalesModel;
    public meta: ITableData;
    @ViewChild('table') public table: TableCollectionComponent;

    public constructor(
        private saleService: SaleService,
        private route: ActivatedRoute
    ) {
        this.meta = {
            host: this,
            cols: [
                { header: 'Created', property: 'createdDatetime', type: ValueFormatedType.date },
                { header: 'Alias', property: 'alias' },
                { header: 'Total', property: 'total', type: ValueFormatedType.money },
            ],
            filters: [
                { type: 1, alias: 'Alias', size: 6, loader: {
                    type: 1, property: 'alias', regexPattern: '{{value}}', regexFlags: 'i'
                } }
            ],
            buttons: [
                { name: 'Create', event: 'create_click', style: 'btn-primary', active: ActiveButtonType.normal, icon: 'fa-plus-circle' },
                { name: 'Edit', event: 'edit_click', style: 'btn-info', active: ActiveButtonType.single, icon: 'fa-edit' },
                { name: 'Delete', event: 'delete_click', style: 'btn-danger btn-outlined', active: ActiveButtonType.multi, icon: 'fa-user-times' }
            ],
            apiItems: saleService.call.loaderSales
        }
        this.model = route.snapshot.data.model;
    }

    public create_click(): void {
        this.saleService.base.router.navigate(['../sale/form/create'], { relativeTo: this.route });
    }

    public edit_click(items: any[]): void {
        const id = items[0]._id;
        this.saleService.base.router.navigate(['../sale/form', id], { relativeTo: this.route });
    }

    public async delete_click(items: any[]): Promise<void> {
        const ids = items.map(i => i._id);
        await this.saleService.call.salesDelete(this.route.snapshot.params['nickName'], ids);
        await this.table.refresh();
    }
}

export const SalePath = <Route>{
    path: 'sales',
    component: SaleComponent,
    resolve: { model: GenericResolver },
    data: <IGenericResolverData>{
        params: ['nickName'],
        services: [SaleService],
        getMethod: data => {
            const nickName = data.params[0];
            const saleService = data.services[0] as SaleService;
            return saleService.call.getSalesModel(nickName);
        }
    }
}