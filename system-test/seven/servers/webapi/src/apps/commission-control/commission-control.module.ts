import { CommissionControlModule } from '@seven/commission-control';
import { Module } from 'providerjs';
//import * as hub from './';

@Module({
    // imports: [CommissionControlModule],
    // providers: [hub.COMMISSIONCONTROL_ALL_HUBS],
    // exports: [CommissionControlModule, hub.COMMISSIONCONTROL_ALL_HUBS]
})
export default class CommissionControlApiModule {

}

export function getPath(name: string): Object | undefined {
    switch (name) {
        //case 'sale': return hub.SaleSHub;
        default: return undefined;
    }
}