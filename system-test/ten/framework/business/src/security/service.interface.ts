import { BusinessCallContext } from "../provider";

export const SECURITYSERVICEIDENTIFY = 'SECURITYSERVICEIDENTIFY';

export interface ISecurityService {
    checkAuthorized(security: string, businessCallContext: BusinessCallContext): Promise<boolean>;
}