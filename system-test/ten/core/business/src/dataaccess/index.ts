export * from './login.dataaccess';
export * from './profile.dataaccess';
export * from './session.dataaccess';
export * from './security.dataaccess';
export * from './security-set.dataaccess';
export * from './relation.dataaccess';

import { LoginDataAccess } from './login.dataaccess';
import { ProfileDataAccess } from './profile.dataaccess';
import { SessionDataAccess } from './session.dataaccess';
import { SecurityDataAccess } from './security.dataaccess';
import { SecuritySetDataAccess } from './security-set.dataaccess';
import { RelationDataAccess } from './relation.dataaccess';
export const CORE_ALL_DATAACCESS: any[] = [
    LoginDataAccess,
    ProfileDataAccess,
    SessionDataAccess,
    SecurityDataAccess,
    SecuritySetDataAccess,
    RelationDataAccess
]