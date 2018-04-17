import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import * as view from './view/index';
import * as core from '../core/index';

export const appRouting: ModuleWithProviders = RouterModule.forRoot([
    { path: '', redirectTo: '', pathMatch: 'full', canActivate: [core.StartPageGuard] },
    { path: '', component: view.PublicLayoutComponent, canActivateChild: [core.PublicRouterGuard], children: [
        { path: 'home', component: view.HomeComponent },
        ...core.corePublicRouting
    ] },
    { path: '', component: view.PrivateLayoutComponent, canActivateChild: [core.PrivateRouterGuard], children: [
        { path: 'dashboard', component: view.DashboardComponent }
    ] },
    { path: '**', component: view.NotFoundComponent }
], { enableTracing: false, useHash: true });

export const VIEWS: any[] = [
    view.PublicLayoutComponent,
    view.PrivateLayoutComponent,
    view.HomeComponent,
    view.NotFoundComponent,
    view.DashboardComponent
];