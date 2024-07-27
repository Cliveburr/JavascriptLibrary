import { TenError } from '../error/ten.error';
import { Interception, IInterceptPreEvent, IInterceptPosEvent, IInterceptErrorEvent, IInterceptEventContext,
    AsRequestProvider, Identify } from 'providerjs';
import { ISecurityService, SECURITYSERVICEIDENTIFY } from '../security/service.interface';
import { BusinessCallContext } from '../provider';

export interface BusinessEventData {
    security?: string;
}

@Interception({
    provider: AsRequestProvider
})
export class ClassBusinessInterception implements IInterceptPreEvent, IInterceptPosEvent, IInterceptErrorEvent {
    
    private methodsData: { [method: string]: BusinessEventData };

    public constructor(
        private businessCallContext: BusinessCallContext,
        @Identify(SECURITYSERVICEIDENTIFY) private securityService: ISecurityService
    ) {
        this.methodsData = {};
    }

    public isPreEventApply(cls: Object, methodName: string): boolean {
        const data = <BusinessEventData>Reflect.getMetadata('businessevent:data', cls, methodName);
        if (data) {
            if (data.security) {
                this.methodsData[methodName] = data;
                return true;
            }
        }
        return false;
    }
    
    public async preEvent(context: IInterceptEventContext): Promise<void> {
        try {
            const data = this.methodsData[context.methodName];
            if (data) {
                if (data.security) {
                    const authorized = await this.securityService.checkAuthorized(data.security, this.businessCallContext);
                    if (!authorized) {
                        throw "Unauthorized!";
                    }
                }
            }
        }
        catch (error: any) {
            if (TenError.isTenError(error)) {
                context.error = error;
            }
            else {
                context.error = new TenError(error);
            }
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

        if (!TenError.isTenError(context.error)) {
            const msg = context.error?.message || context.error;
            context.error = new TenError(msg);
        }
    }
}