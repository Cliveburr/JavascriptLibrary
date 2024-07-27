import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as view from './view';

export const routes: Routes = [
    { path: '', component: view.HomeComponent, },
    view.SalePath,                       // path: 'sales'
    view.SaleFormPath,                   // path: 'sale/edit/:id'
    { path: 'batches', component: view.BatchComponent },
    { path: 'batch/:id', component: view.BatchFormComponent }
]

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class CommissionControlRoutingModule {
}
