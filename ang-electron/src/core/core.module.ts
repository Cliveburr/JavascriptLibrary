import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { VIEWS } from './core.routing';
import { SERVICES } from './service/index';
import * as security from './security/index';
import { CommonModule } from '../common/index';

@NgModule({
    imports: [BrowserModule, FormsModule, CommonModule],
    declarations: [VIEWS],
    providers: [security.PrivateRouterGuard, security.PublicRouterGuard, security.StartPageGuard,
        SERVICES ]
})
export class CoreModule {
}