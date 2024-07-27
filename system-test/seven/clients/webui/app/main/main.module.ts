import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MainLayoutComponent } from '../core';
import { CoreModule } from '../core/core.module';
//import { AppModule } from '../app/app.module';
import { MainRoutingModule } from './main.routing';
import { ALL_INITIALIZERS } from './initialize.service';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule, FormsModule, BrowserAnimationsModule, MainRoutingModule,
    CoreModule //, AppModule
  ],
  providers: [
    ALL_INITIALIZERS
  ],
  bootstrap: [MainLayoutComponent]
})
export class MainModule { }
