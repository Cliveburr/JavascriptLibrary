import { IProvider, InjectorContext } from 'providerjs';
import { BusinessContext } from './business.context';

export class StaticBusinessProvider implements IProvider {
    
    public constructor(
        private KEY_META: string,
        private business: any[]
    ) {
    }
    
    public identify(identifier: any): boolean {
        if (typeof identifier != 'function') {
            return false;
        }

        const isForThisProvider = <boolean>Reflect.getOwnMetadata(this.KEY_META, identifier);
        if (isForThisProvider) {
            return true;
        }
        else {
            const inBusiness = this.business
                .find(b => b === identifier);
            if (inBusiness) {
                Reflect.defineMetadata(this.KEY_META, true, identifier);
                return true;
            }
        }
        return false;
    }
    
    public get(context: InjectorContext): any {
        const businessContext = this.getBusinessContext(context.extraData);
        if (businessContext) {
            return this.getInternal(context, businessContext, false);
        }
        else {
            return this.getExternal(context);
        }
    }

    private getBusinessContext(extraData?: any[]): BusinessContext | undefined {
        if (extraData) {
            const hasBusiness = extraData
                .find(b => b instanceof BusinessContext);
            if (hasBusiness) {
                return hasBusiness;
            }
        }
        return undefined;
    }
    
    private getExternal(context: InjectorContext): any {
        const businessContext = context.create(BusinessContext);
        if (!context.extraData) {
            context.extraData = [];
        }
        context.extraData.push(businessContext);
        return this.getInternal(context, businessContext, true);
    }

    private getInternal(context: InjectorContext, businessContext: BusinessContext, fromExternal: boolean): any {
        const hasCreated = businessContext.instances
            .find(b => b instanceof context.identifier);
        if (hasCreated) {
            return hasCreated;
        }
        else {
            const customs: IProvider[] = [businessContext.provider];
            //const extraData = fromExternal ? [businessContext] : undefined;
            const instance = context.create(context.identifier, customs, context.extraData);
            businessContext.instances.push(instance);
            return instance;
        }
    }
}

