import { Route } from '@angular/router';

import * as view from './view/index';

export const corePublicRouting: Route[] = [
    { path: 'login', component: view.LoginComponent },
    { path: 'register', component: view.RegisterComponent }
];

export const VIEWS: any[] = [
    view.LoginComponent,
    view.RegisterComponent,
];