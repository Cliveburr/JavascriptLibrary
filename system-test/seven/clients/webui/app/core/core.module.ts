import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
const ALL_NGX_MODULES = [
    BsDropdownModule.forRoot()
]

import { CORE_ALL_COMPONENTS, CORE_ALL_PIPES, CORE_ALL_SERVICE, CORE_ALL_VIEWS } from '../core';
import { FrameworkModule } from '../framework/framework.module';
import { LoggedRouterGuard } from '../main/route-guard.service';

@NgModule({
    declarations: [
        CORE_ALL_COMPONENTS, CORE_ALL_PIPES, CORE_ALL_VIEWS
    ],
    imports: [
        RouterModule, CommonModule, FormsModule,
        ALL_NGX_MODULES,
        FrameworkModule.forRoot()
    ],
    providers: [
        CORE_ALL_SERVICE,
        LoggedRouterGuard
    ]
})
export class CoreModule {
}
