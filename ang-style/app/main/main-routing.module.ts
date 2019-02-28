import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GridShowComponent } from '../layout';

const routes: Routes = [
	{ path: '', component: GridShowComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
