import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// const ALL_NGX_MODULES = [
//     BsDropdownModule.forRoot()
// ]

import { COMISSIONCONTROL_ALL_VIEWS } from './view';
import { COMISSIONCONTROL_ALL_SERVICE } from './service';
import { FrameworkModule } from '../../framework/framework.module';
import { CommissionControlRoutingModule } from './commission-control.routing';

@NgModule({
    declarations: [
        COMISSIONCONTROL_ALL_VIEWS
    ],
    imports: [
        CommissionControlRoutingModule, CommonModule, FormsModule,
        //ALL_NGX_MODULES,
        FrameworkModule
    ],
    providers: [
        COMISSIONCONTROL_ALL_SERVICE
    ]
})
export class CommissionControlModule {
}
