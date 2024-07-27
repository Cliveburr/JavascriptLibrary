import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxCurrencyModule } from "ngx-currency";
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { defineLocale  } from 'ngx-bootstrap/chronos';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

defineLocale('pt-br', ptBrLocale);

const ALL_NGX_MODULES = [
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    BsDatepickerModule .forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    NgxCurrencyModule
]

import { FRAMEWORK_ALL_COMPONENTS, FRAMEWORK_ALL_COMPONENTS_SERVICES, FRAMEWORK_ALL_DIRECTIVE, FRAMEWORK_ALL_SERVICE, FRAMEWORK_ALL_RESOLVER, BaseService } from './';

@NgModule({
    declarations: [
        FRAMEWORK_ALL_COMPONENTS, FRAMEWORK_ALL_DIRECTIVE
    ],
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, RouterModule,
        ALL_NGX_MODULES
    ],
    providers: [
        FRAMEWORK_ALL_SERVICE, FRAMEWORK_ALL_RESOLVER, FRAMEWORK_ALL_COMPONENTS_SERVICES
    ],
    exports: [
        FRAMEWORK_ALL_COMPONENTS, FRAMEWORK_ALL_DIRECTIVE,
        ALL_NGX_MODULES
    ]
})
export class FrameworkModule {

    public static forRoot(): ModuleWithProviders<FrameworkModule> {
        return {
          ngModule: FrameworkModule,
          providers: [ BaseService ]
        }
    }
}
