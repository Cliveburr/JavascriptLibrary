import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { CORE_ALL_VIEWS } from './view';
import { CORE_ALL_COMPONENTS, CORE_ALL_COMPONENTS_PROVIDERS } from './component';
// import {  CORE_ALL_PIPES, } from '../core';
import { FrameworkModule } from '../framework/framework.module';
import { CORE_ALL_SERVICE } from './service';
// import { LoggedRouterGuard } from '../main/route-guard.service';

@NgModule({
    declarations: [
        CORE_ALL_VIEWS,
        CORE_ALL_COMPONENTS
        // CORE_ALL_PIPES
    ],
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        FrameworkModule
    ],
    providers: [
        CORE_ALL_SERVICE,
        CORE_ALL_COMPONENTS_PROVIDERS,
        // LoggedRouterGuard
    ]
})
export class CoreModule {
}
