import { IProvider, InjectorContext } from 'providerjs';
import { BusinessContext } from './business.context';

export class BusinessProvider implements IProvider {

    private regexService: RegExp;
    private businessIdentifieds: { [path: string]: any };

    public constructor(
        private area: string,
        private business: any[]
    ) {
        this.regexService = /I(.*)Service/;
        this.businessIdentifieds = {};
    }
    
    public identify(identifier: any): boolean {
        if (typeof identifier != 'string') {
            return false;
        }

        if (identifier in this.businessIdentifieds) {
            return true;
        }
        else {
            const pathParts = identifier.split('.');
            const areaName = pathParts[0];
            if (areaName != this.area) {
                return false;
            }
            const serviceName = pathParts[1];
            var regex = this.regexService.exec(serviceName);
            if (regex) {
                var businessName = regex[1] + "Business";
                const business = this.business
                    .find(b => b.name == businessName);
                if (business) {
                    this.businessIdentifieds[identifier] = business;
                    return true;
                }
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
        const business =  this.businessIdentifieds[context.identifier];
        const hasCreated = businessContext.instances
            .find(b => b instanceof business);
        if (hasCreated) {
            return hasCreated;
        }
        else {
            const customs: IProvider[] = [businessContext.provider];
            const instance = context.create(business, customs, context.extraData);
            businessContext.instances.push(instance);
            return instance;
        }
    }
}