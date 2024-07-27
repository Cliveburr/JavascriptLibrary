import { Routes } from '@angular/router';
//import { LoggedRouterGuard } from 'app/main/route-guard.service';
import * as view from './';

export const appRouting: Routes = [
    // { path: '', canActivateChild: [LoggedRouterGuard], children: [
    //     { path: 'apps', component: view.AppsComponent },
    //     { path: ':nickName/commission-control', loadChildren: () => import('../apps/commission-control/commission-control.module').then(m => m.CommissionControlModule) }
    // ] }
];
 