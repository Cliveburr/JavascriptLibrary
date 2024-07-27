import { Module } from 'providerjs';
//import * as hub from './hub';

@Module({
    // providers: [hub.APP_ALL_HUBS],
    // exports: [hub.APP_ALL_HUBS]
})
export default class AppModule {

}

export function getPath(name: string): Object | undefined {
    switch (name) {
        //case 'apps': return hub.AppsSHub;
        default: return undefined;
    }
}