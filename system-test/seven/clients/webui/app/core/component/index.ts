export * from './modal/confirm-by-text.component';
export * from './modal/group-select.component';
export * from './modal/relation-select.component';

import { ConfirmByTextComponent } from './modal/confirm-by-text.component';
import { GroupSelectComponent } from './modal/group-select.component';
import { RelationSelectComponent } from './modal/relation-select.component';
export const CORE_ALL_MODAL_COMPONENTS = [
    ConfirmByTextComponent,
    GroupSelectComponent,
    RelationSelectComponent
]

export * from './translate/translate.component';
export * from './navbar/navbar.component';

import { TranslateComponent } from './translate/translate.component';
import { NavbarComponent } from './navbar/navbar.component';
export const CORE_ALL_COMPONENTS = [
    CORE_ALL_MODAL_COMPONENTS,
    TranslateComponent,
    NavbarComponent
]