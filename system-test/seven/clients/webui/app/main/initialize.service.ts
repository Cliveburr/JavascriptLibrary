import { APP_INITIALIZER, Provider, Injectable } from '@angular/core'
import { LoginService, TranslateService } from 'app/core';

@Injectable()
export class InitializerService {

    public constructor(
        private loginService: LoginService,
        private translateService: TranslateService
    ) {
    }

    public async load(): Promise<void> {
        await this.loginService.authenticationByToken();
        //await this.translateService.load();
    }
}

export function InitializerProviderFactory(initializertService: InitializerService) {
    return () => initializertService.load();
}

export const InitializerProvider: Provider = {
    provide: APP_INITIALIZER,
    useFactory: InitializerProviderFactory,
    deps: [InitializerService],
    multi: true
};

export const ALL_INITIALIZERS = [
    InitializerService,
    InitializerProvider
];