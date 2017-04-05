import './rxjs-extensions';
import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { BsDropdownModule, TabsModule } from 'ng2-bootstrap';
import { NAV_DROPDOWN_DIRECTIVES } from '../directive/nav-dropdown.directive';
import { BreadcrumbsComponent } from '../component/breadcrumb.component';
import { SIDEBAR_TOGGLE_DIRECTIVES } from '../directive/sidebar.directive';
import { AsideToggleDirective } from '../directive/aside.directive';

import { MainRoutingModule } from './main.routing';
import { MainComponent } from './main.component';
import { MainLayoutComponent } from '../view/shared/main-layout.component';

@NgModule({
  imports: [ BrowserModule, MainRoutingModule, BsDropdownModule.forRoot(), TabsModule.forRoot() ],
  declarations: [ MainComponent, MainLayoutComponent, NAV_DROPDOWN_DIRECTIVES, BreadcrumbsComponent, SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective ],
  bootstrap: [ MainComponent ],
  providers: [ { provide: LocationStrategy, useClass: HashLocationStrategy } ],
})
export class MainModule {
    
 }