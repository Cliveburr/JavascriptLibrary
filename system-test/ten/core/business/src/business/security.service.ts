import { Assert, BusinessCallContext, SecurityModel, SecurityModelSet, SECURITYSERVICEIDENTIFY } from "@ten/framework_business";
import { ISecurityService } from "@ten/framework_business";
import { Injectable } from "providerjs";
import { ProfileDataAccess, SecuritySetDataAccess } from "../dataaccess";
import { ObjectHelper } from "../helpers";

export const SecurityModels: { [domain: string]: SecurityModel } = {};

@Injectable({
    identity: SECURITYSERVICEIDENTIFY
})
export class SecurityService implements ISecurityService {

    public constructor(
        private profileAccess: ProfileDataAccess,
        private securitySetAccess: SecuritySetDataAccess
    ) {
    }

    public async checkAuthorized(security: string, businessCallContext: BusinessCallContext): Promise<boolean> {

        const sessionProfileId = businessCallContext.sessionProfileId;
        if (!sessionProfileId) {
            return false;
        }

        const profile = await this.profileAccess.getByNickName(businessCallContext.locationProfile);
        Assert.mustNotNull(profile, 'Perfil não encontrado!');
        
        if (profile._id.equals(sessionProfileId)) {
            return true;
        }

        const parts = security
            .split('.');
        if (parts.length < 2) {
            throw 'Invalid security! ' + security;
        }
        const domain = parts[0]!;
        const namesParts = parts.slice(1);
        const secrityStructSet = this.getSecurityStructSet(domain, namesParts);

        const securitySet = await this.securitySetAccess.getSecuritySet(profile._id, sessionProfileId, domain)
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

    private getSecurityStructSet(domain: string, namesParts: string[]): SecurityModelSet {
        const struct = SecurityModels[domain];
        if (struct) {
            const setStruct = ObjectHelper.resolveNamespace(struct, namesParts)
            if (this.isStructSet(setStruct)) {
                return setStruct;
            }
        }
        throw `Security domain '${domain}' dont have key: ` +
            namesParts.join('.');
    }

    private isStructSet(test: SecurityModel | SecurityModelSet): test is SecurityModelSet {
        return typeof test != undefined && typeof test.default != 'undefined' && typeof test.key != 'undefined';
    }
}
