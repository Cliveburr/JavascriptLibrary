export * from './modal/security-modal.component';
export * from './modal/profile-select.component';

import { SecurityModalComponent } from './modal/security-modal.component';
import { ProfileSelectComponent } from './modal/profile-select.component';
const CORE_ALL_MODALS = [
    SecurityModalComponent,
    ProfileSelectComponent
]

//export * from './translate/translate.component';
export * from './navbar/navbar.component';

//import { TranslateComponent } from './translate/translate.component';
import { NavbarComponent } from './navbar/navbar.component';
export const CORE_ALL_COMPONENTS = [
    ...CORE_ALL_MODALS,
    //TranslateComponent,
    NavbarComponent
]

import { SECURITY_MODAL } from 'src/framework';
export const CORE_ALL_COMPONENTS_PROVIDERS = [
    { provide: SECURITY_MODAL, useValue: SecurityModalComponent }
]