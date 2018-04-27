import 'rxjs/Rx';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { appRouting, VIEWS } from './app.routing';
//import { MainProviders } from './service/main/main.service';

@NgModule({
    imports: [BrowserModule, FormsModule, appRouting],
    bootstrap: [AppComponent],
    declarations: [AppComponent, VIEWS],
    providers: []
})
export class AppModule {
}