export * from './login.service';
export * from './translate.service';
export * from './translate-path.service';
export * from './profile.service';
export * from './group.service';
export * from './relation.service';

import { LoginService } from './login.service';
import { TranslateService } from './translate.service';
import { TranslatePathService } from './translate-path.service';
import { ProfileService } from './profile.service';
import { GroupService } from './group.service';
import { RelationService } from './relation.service';
export const CORE_ALL_SERVICE = [
    LoginService,
    TranslateService,
    TranslatePathService,
    ProfileService,
    GroupService,
    RelationService
]
