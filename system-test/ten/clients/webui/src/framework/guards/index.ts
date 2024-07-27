export * from './logged-route.guard';
export * from './not-logged-route.guard';
export * from './route.resolver';

import { LoggedRouterGuard } from './logged-route.guard';
import { NotLoggedRouterGuard } from './not-logged-route.guard';
import { ProfileResolver } from './route.resolver';
export const FRAMEWORK_ALL_GUARDS = [
    LoggedRouterGuard,
    NotLoggedRouterGuard,
    ProfileResolver
]