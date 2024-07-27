import { Interception, IInterceptPreEvent, IInterceptPosEvent, IInterceptErrorEvent, IInterceptEventContext, AsRequestProvider } from 'providerjs';
import { ObjectId, SevenError } from '@seven/framework';
import { AppsBusiness, AppsEnum } from '@seven/app';

export const AppBusinessClass = (): ClassDecorator => {
    return (cls: Object) => {
        Reflect.defineMetadata('intercept:is', true, cls);
        Reflect.defineMetadata('intercept:customs', [AppClassHandlerInterception], cls);
    }
}

@Interception({
    provider: AsRequestProvider
})
export class AppClassHandlerInterception implements IInterceptPreEvent {
    
    public constructor(
        private appsBusiness: AppsBusiness
    ) {
    }

    public isPreEventApply(cls: Object, methodName: string): boolean {
        const isBusinesEvent = Reflect.getMetadata('businessevent:is', cls, methodName);
        return isBusinesEvent || false;
    }
    
    public async preEvent(context: IInterceptEventContext): Promise<void> {
        if (!(await this.appsBusiness.checkAndSetInstance(AppsEnum.CommissionControl))) {
            const error = new SevenError('You don\'t have this application installed!');
            error.redirect = 'apps'
            context.error = error;
            context.throwError = true;
            context.processed = true;
        }
    }

    // public isErrorEventApply(cls: Object, methodName: string): boolean {
    //     return false;
    // }
    
    // public errorEvent(context: IInterceptEventContext): void {

    //     context.error = new SevenError(context.error);
    // }
}