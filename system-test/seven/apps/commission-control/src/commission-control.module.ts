import { Module } from 'providerjs';
import { StaticBusinessProvider } from '@seven/core';
import { COMMISSIONCONTROL_ALL_BUSINESS } from './business';
import { CommissionControlDatabase } from './dataaccess/commission-control.database';

const businessProvider = new StaticBusinessProvider('app:commission-control:is', COMMISSIONCONTROL_ALL_BUSINESS);

@Module({
    providers: [businessProvider, CommissionControlDatabase],
    exports: [businessProvider]
})
export class CommissionControlModule {

}
