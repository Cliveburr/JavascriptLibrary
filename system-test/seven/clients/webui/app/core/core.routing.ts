import { Routes } from '@angular/router';
import * as view from './';
import { LoggedRouterGuard } from '../main/route-guard.service';

export const coreRouting: Routes = [
    { path: 'site', children: [
        { path: '', component: view.HomeSiteComponent }
    ] },
    { path: 'login', component: view.ProfileLoginComponent },
    { path: 'register', component: view.ProfileRegisterComponent },

    { path: '', canActivateChild: [LoggedRouterGuard], children: [
        { path: 'profiles', component: view.ProfilesComponent },
        // { path: 'admin/profiles', component: view.AdminProfileComponent },
        // { path: 'admin/profile/:id/session', component: view.AdminSessionComponent },
        // { path: 'admin/profile/:id/login', component: view.AdminLoginComponent },
        view.ProfileRelationsPath,          // path: ':profile/relations'
        view.ProfileRelationPath,           // path: ':profile/relation/:id'
        view.ProfileHomePath,               // path: ':profile'
        view.ProfileViewPath,               // path: ':profile/profile'
        view.ProfileGroupsPath,             // path: ':profile/groups'
        view.ProfileGroupPath               // path: ':profile/group/:id'
    ] }
];

/*

url/site                           = ecommerce
url/login                          = login page
url/register                       = create profile
url/profiles                       = list of all profiles

url/:profile                       = home of profile
url/:profile/desktop               = desktop of profile
url/:profile/profile               = main page of profile
url/:profile/relations             = list of relations of profile
url/:profile/relation/:id          = view of relation
url/:profile/groups                = list of groups of profile
url/:profile/group/:id             = view of group

url/:profile/:app                  = home of app


*/