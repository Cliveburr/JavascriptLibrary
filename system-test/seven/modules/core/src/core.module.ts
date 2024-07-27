import { Module } from 'providerjs';
import { CORE_ALL_BUSINESS, StaticBusinessProvider } from './business';
import { CoreDatabase } from './dataaccess/core.database';

const businessProvider = new StaticBusinessProvider('core:business:is', CORE_ALL_BUSINESS);

@Module({
    providers: [businessProvider, CoreDatabase],
    exports: [businessProvider]
})
export class CoreModule {

}
