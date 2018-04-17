import { Injectable, APP_INITIALIZER, Injector } from '@angular/core'
//import { TranslateService } from '../../translate/translate.service';
//import { LoginService } from '../../service/main/login.service';

@Injectable()
export class MainService {

    public constructor(
        //private translateService: TranslateService,
        //private loginService: LoginService
    ) {
    }

    public load(): Promise<any> {
        return Promise.all([
            //this.translateService.load(),
            //this.loginService.load()
            // new Promise((e, r) => {
            //     setTimeout(_ => e(), 10000);
            // })
        ]);
    }
}

export function MainProviderFactory(mainService: MainService): any {
    return () => mainService.load()
};

export const MainProviders = [
    MainService,
    {
        provide: APP_INITIALIZER,
        useFactory: MainProviderFactory,
        deps: [MainService],
        multi: true
    }
];