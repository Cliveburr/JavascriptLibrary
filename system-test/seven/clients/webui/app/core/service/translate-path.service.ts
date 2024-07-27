import { Injectable, Provider } from '@angular/core';

@Injectable()
export class TranslatePathService {

    public constructor(
        public path: string
    ) {
    }

    public static forPath(path: string): Provider {
        let serviceFactory = () => {
            return new TranslatePathService(path);
        };

        return {
            provide: TranslatePathService,
            useFactory: serviceFactory,
            deps: []
        };
    }
}
