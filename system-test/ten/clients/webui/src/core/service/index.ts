export * from '../../../../../core/interface/src/service';
export * from '../../../../../core/interface/src/model';

import { businessProviderFor } from 'src/framework';

import { ISecurityService, IProfileService, IRelationService } from '../../../../../core/interface/src/service';
export const CORE_ALL_BUSINESS = businessProviderFor('core',
    ISecurityService,
    IProfileService,
    IRelationService
);

export * from './login.service';
export * from './core-modal.service';

import { LoginService } from './login.service';
import { CoreModalService } from './core-modal.service';
export const CORE_ALL_SERVICE = [
    ...CORE_ALL_BUSINESS,
    LoginService,
    CoreModalService
]