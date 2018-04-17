import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {
    MatButtonModule, MatCheckboxModule, MatToolbarModule
} from '@angular/material';
const MATERIAL = [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule
];

@NgModule({
    imports: [BrowserModule, MATERIAL],
    declarations: [],
    providers: [],
    exports: [MATERIAL]
})
export class CommonModule {
}