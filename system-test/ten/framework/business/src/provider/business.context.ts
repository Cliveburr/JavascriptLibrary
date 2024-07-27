import { DefinedProvider, Injectable } from 'providerjs';
import { ObjectId } from '../dataaccess';

@Injectable()
export class BusinessContext {
    
    public instances: any[];
    public provider: DefinedProvider;

    public constructor(
    ) {
        this.instances = [];
        this.provider = new DefinedProvider(BusinessContext, this);
    }
}

@Injectable()
export class BusinessCallContext {

    public sessionGuid!: string;
    public remoteAddress!: string;

    public sessionProfileId?: ObjectId;

    public locationProfile?: string;
    public locationApp?: string;
}
