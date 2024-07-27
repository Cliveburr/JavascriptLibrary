import { SevenError } from '@seven/framework';
import { Interception, IInterceptPreEvent, IInterceptPosEvent, IInterceptErrorEvent, IInterceptEventContext,
    AsRequestProvider} from 'providerjs';
import { LocationPaths } from '../../model';
import { LocationBusiness } from '../location.business';
import { SecuritySetBusiness } from '../security-set.business';

export interface BusinessEventData {
    locationProfile?: boolean;
    security?: string;
}

@Interception({
    provider: AsRequestProvider
})
export class ClassBusinessInterception implements IInterceptPreEvent, IInterceptPosEvent, IInterceptErrorEvent {
    
    private methodsData: { [method: string]: BusinessEventData };

    public constructor(
        private locationPaths: LocationPaths,
        private locationBusiness: LocationBusiness,
        private securitySetBusiness: SecuritySetBusiness
    ) {
        this.methodsData = {};
    }

    public isPreEventApply(cls: Object, methodName: string): boolean {
        let apply = false;
        const data = <BusinessEventData>Reflect.getMetadata('businessevent:data', cls, methodName);
        if (data) {
            if (data.locationProfile || data.security) {
                apply = true;
                this.methodsData[methodName] = data;
            }
        }
        return apply;
    }
    
    public async preEvent(context: IInterceptEventContext): Promise<void> {
        try {
            const data = this.methodsData[context.methodName];
            if (data) {
                if (data.locationProfile) {
                    const locationProfile = await this.locationBusiness.getLocationProfile(this.locationPaths.profile);

                    if (data.security) {
                        const authorized = await this.securitySetBusiness.checkAuthorized(locationProfile, data.security);
                        if (!authorized) {
                            throw "Unauthorized!";
                        }
                    }
        
                    context.arguments = (<Object[]>[locationProfile]).concat(context.arguments);
                }
            }
        }
        catch (error) {
            context.error = new SevenError(error);
            context.throwError = true;
            context.processed = true;
        }
    }

    public isPosEventApply(cls: Object, methodName: string): boolean {
        return false;
    }
    
    public posEvent(context: IInterceptEventContext): void {
    }

    public isErrorEventApply(cls: Object, methodName: string): boolean {
        return true;
    }
    
    public errorEvent(context: IInterceptEventContext): void {

        if (!SevenError.isSevenError(context.error)) {
            context.error = new SevenError(context.error);
        }
    }
}