export * from './shared/mainlayout.component';
export * from './site/home-site.component';
export * from './profile/register.component';
export * from './profile/login.component';
export * from './profile/profiles.component';
export * from './profile/home.component';
export * from './profile/profile.component';
export * from './relation/relations.component';
export * from './relation/relation.component';
// export * from './admin/profile/admin-profile.component';
// export * from './admin/profile/admin-session.component';
// export * from './admin/profile/admin-login.component';
export * from './group/groups.component';
export * from './group/group.component';

import { MainLayoutComponent } from './shared/mainlayout.component';
import { HomeSiteComponent } from './site/home-site.component';
import { ProfileRegisterComponent } from './profile/register.component';
import { ProfileLoginComponent } from './profile/login.component';
import { ProfilesComponent } from './profile/profiles.component';
import { ProfileHomeComponent } from './profile/home.component';
import { ProfileComponent } from './profile/profile.component';
import { RelationsComponent } from './relation/relations.component';
import { RelationComponent } from './relation/relation.component';
// import { AdminProfileComponent } from './admin/profile/admin-profile.component';
// import { AdminSessionComponent } from './admin/profile/admin-session.component';
// import { AdminLoginComponent } from './admin/profile/admin-login.component';
import { GroupsComponent } from './group/groups.component';
import { GroupComponent } from './group/group.component';
export const CORE_ALL_VIEWS = [
    MainLayoutComponent,
    HomeSiteComponent,
    ProfileRegisterComponent,
    ProfileLoginComponent,
    ProfilesComponent,
    ProfileHomeComponent,
    ProfileComponent,
    RelationsComponent,
    RelationComponent,
    // AdminProfileComponent,
    // AdminSessionComponent,
    // AdminLoginComponent,
    GroupsComponent,
    GroupComponent
]