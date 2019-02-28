import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { GRID_COMPONENTS } from '../layout';

@NgModule({
	declarations: [
		MainComponent,
		GRID_COMPONENTS
	],
	imports: [
		BrowserModule,
		AppRoutingModule
	],
	providers: [],
	bootstrap: [MainComponent]
})
export class MainModule { }