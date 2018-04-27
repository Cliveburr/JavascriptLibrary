import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import * as view from './view/index';

export const appRouting: ModuleWithProviders = RouterModule.forRoot([
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '', component: view.LayoutComponent, children: [
        { path: 'home', component: view.HomeComponent },
    ] }
], { enableTracing: false, useHash: true });

export const VIEWS: any[] = [
    view.LayoutComponent,
    view.HomeComponent
];