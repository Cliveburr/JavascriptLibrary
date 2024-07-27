import { ObjectHelper, SecurityStruct, SecurityStructSet, Session } from '@seven/framework';
import { Injectable } from 'providerjs';
import { CoreDatabase } from '../dataaccess/core.database';
import { LocationProfile } from '../model';
import { CoreSecurityDomain } from '../security/core-security';

@Injectable()
export class SecuritySetBusiness {

    private structs: { [domain: string]: SecurityStruct };

    public constructor(
        private core: CoreDatabase,
        private session: Session
    ) {
        this.structs = {
            core: CoreSecurityDomain
        }
    }

    public async checkAuthorized(lprofile: LocationProfile, security: string): Promise<boolean>  {

        const parts = security
            .split('.');
        if (parts.length < 2) {
            throw 'Invalid security! ' + security;
        }
        const domain = parts[0]!;
        const namesParts = parts.slice(1);

        const secrityStructSet = this.getSecurityStructSet(domain, namesParts);

        const securitySetAccess = await this.core.securitySet;
        const securitySet = await securitySetAccess.getSecuritySet(lprofile._id, this.session.profileId, domain)
        
        if (securitySet == null)
        {
            return secrityStructSet.default;
        }
        else {
            const perm = secrityStructSet.key < securitySet.sets.length ?
                securitySet.sets.substr(secrityStructSet.key, 1) :
                '0';
            switch (perm) {
                case '0': return secrityStructSet.default;
                case '1': return true;
                case '2': return false;
                default:
                    throw 'Invalid!';
            }
        }
    }

    private getSecurityStructSet(domain: string, namesParts: string[]): SecurityStructSet {
        const struct = this.structs[domain];
        if (struct) {
            const setStruct = ObjectHelper.resolveNamespace(struct, namesParts)
            if (this.isStructSet(setStruct)) {
                return setStruct;
            }
        }
        throw `Security domain '${domain}' dont have key: ` +
            namesParts.join('.');
    }

    private isStructSet(test: SecurityStruct | SecurityStructSet): test is SecurityStructSet {
        return typeof test != undefined && typeof test.default != 'undefined' && typeof test.key != 'undefined';
    }
}