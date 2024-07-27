import { Module } from 'providerjs';
import { StaticBusinessProvider } from '@seven/core';
import { APP_ALL_BUSINESS } from './business';
import { AppDatabase } from './dataaccess/app.database';

const businessProvider = new StaticBusinessProvider('app:business:is', APP_ALL_BUSINESS);

@Module({
    providers: [businessProvider, AppDatabase],
    exports: [businessProvider]
})
export class AppModule {

}
