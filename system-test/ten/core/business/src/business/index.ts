export * from './profile.business';
export * from './security.business';
export * from './security.service';
export * from './relation.business';

import { SecurityService } from './security.service';
export const CORE_ALL_SERVICE = [
    SecurityService
]

import { ProfileBusiness } from './profile.business';
import { SecurityBusiness } from './security.business';
import { RelationBusiness } from './relation.business';
export const CORE_ALL_BUSINESS: any[] = [
    ProfileBusiness,
    SecurityBusiness,
    RelationBusiness
]