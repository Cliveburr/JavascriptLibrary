import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// const ALL_NGX_MODULES = [
//     BsDropdownModule.forRoot()
// ]

import { APP_ALL_SERVICE, APP_ALL_VIEWS } from './';
import { FrameworkModule } from '../framework/framework.module';

@NgModule({
    declarations: [
        //APP_ALL_VIEWS
    ],
    imports: [
        RouterModule, CommonModule, FormsModule,
        //ALL_NGX_MODULES,
        FrameworkModule
    ],
    providers: [
        APP_ALL_SERVICE
    ]
})
export class AppModule {
}
