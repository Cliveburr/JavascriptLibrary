import { Injector, DefinedProvider, Injectable } from 'providerjs';
import { Session } from '@seven/framework';

@Injectable()
export class BusinessContext {
    
    public instances: any[];
    public provider: DefinedProvider;

    public constructor(
        public session: Session,
        private injector: Injector
    ) {
        this.instances = [];
        this.provider = new DefinedProvider(BusinessContext, this);
    }
}