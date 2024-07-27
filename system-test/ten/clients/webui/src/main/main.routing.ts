import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { coreRouting } from '../core/core.routing';
//import { appRouting } from '../app/app.routing';

export const routes: Routes = [
    { path: '', redirectTo: 'site', pathMatch: 'full' },
    //...appRouting,
    ...coreRouting,
    { path: '**', redirectTo: '/site' }
]

@NgModule({
    imports: [ RouterModule.forRoot(routes, { enableTracing: false, relativeLinkResolution: 'legacy' }) ],
    exports: [ RouterModule ]
})
export class MainRoutingModule {
}
