export * from './shared/mainlayout.component';
export * from './site/home-site.component';
export * from './profile/register.component';
export * from './profile/login.component';
export * from './profile/home.component';
export * from './profile/profile.component';
export * from './profile/profiles.component';
export * from './relation/relations.component';

import { MainLayoutComponent } from './shared/mainlayout.component';
import { HomeSiteComponent } from './site/home-site.component';
import { ProfileRegisterComponent } from './profile/register.component';
import { ProfileLoginComponent } from './profile/login.component';
import { ProfileHomeComponent } from './profile/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfilesComponent } from './profile/profiles.component';
import { RelationsComponent } from './relation/relations.component';
export const CORE_ALL_VIEWS = [
    MainLayoutComponent,
    HomeSiteComponent,
    ProfileRegisterComponent,
    ProfileLoginComponent,
    ProfileHomeComponent,
    ProfileComponent,
    ProfilesComponent,
    RelationsComponent
]