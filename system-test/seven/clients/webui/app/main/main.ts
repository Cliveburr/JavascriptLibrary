import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import '@angular/compiler';

import { MainModule } from './main.module';
import { environment } from '../../environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(MainModule)
  .catch(err => console.error(err));
