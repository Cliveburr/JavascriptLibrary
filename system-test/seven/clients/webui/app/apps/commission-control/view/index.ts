export * from './batch/batch-form.component';
export * from './batch/batch.component';
export * from './home/commissioned.component';
export * from './home/home.component';
export * from './sales/sale-form.component';
export * from './sales/sale.component';

import { BatchFormComponent } from './batch/batch-form.component';
import { BatchComponent } from './batch/batch.component';
import { CommissionedComponent } from './home/commissioned.component';
import { HomeComponent } from './home/home.component';
import { SaleFormComponent } from './sales/sale-form.component';
import { SaleComponent } from './sales/sale.component';
export const COMISSIONCONTROL_ALL_VIEWS = [
    BatchFormComponent,
    BatchComponent,
    CommissionedComponent,
    HomeComponent,
    SaleFormComponent,
    SaleComponent
]