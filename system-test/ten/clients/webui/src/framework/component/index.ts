export * from './base.component';
export * from './value-base.component';

export * from './inputs/text-input.component';
export * from './inputs/check-input.component';
export * from './inputs/validators/custom-validators';
export * from './inputs/validators/extend-formcontrol';
export * from './inputs/validators/extend-formgroup';
export * from './inputs/validators/validators.control';
export * from './inputs/validators/form-validator.component';
export * from './inputs/validators/validator-msg.component';
export * from './inputs/portrait/portrait-input.component';
export * from './inputs/color-input.component';
export * from './inputs/file-input.component';
export * from './inputs/portrait/portrait-modal-input.component';

import { TextInputComponent } from './inputs/text-input.component';
import { CheckInputComponent } from './inputs/check-input.component';
import { FormValidatorComponent } from './inputs/validators/form-validator.component';
import { ValidatorMsgComponent } from './inputs/validators/validator-msg.component';
import { PortraitInputComponent } from './inputs/portrait/portrait-input.component';
import { ColorInputComponent } from './inputs/color-input.component';
import { IconInputComponent } from './inputs/icon-input.component';
import { FileInputComponent } from './inputs/file-input.component';
import { PortraitModalInputComponent } from './inputs/portrait/portrait-modal-input.component';
const INPUTS_COMPONENTS = [
    TextInputComponent,
    CheckInputComponent,
    FormValidatorComponent,
    ValidatorMsgComponent,
    PortraitInputComponent,
    ColorInputComponent,
    IconInputComponent,
    FileInputComponent,
    PortraitModalInputComponent
]

export * from './containers/card.component';
export * from './containers/container.component';

import { CardComponent } from './containers/card.component';
import { ContainerComponent } from './containers/container.component';
const CONTAINERS_COMPONENTS = [
    CardComponent,
    ContainerComponent
]

export * from './modal/modal.component';
export * from './modal/modal-base';
export * from './modal/message/modal-message.component';

import { ModalComponent } from './modal/modal.component';
import { MessageModalComponent } from './modal/message/modal-message.component';
export const FRAMEWORK_MODALS = [
    ModalComponent,
    MessageModalComponent
]

export * from './collection/base-collection.component';
export * from './collection/filter/filter.component';
export * from './collection/filter/filters.component';
export * from './collection/view-collection.component';

import { FilterComponent } from './collection/filter/filter.component';
import { FiltersComponent } from './collection/filter/filters.component';
import { ViewCollectionComponent } from './collection/view-collection.component';
const COLLECTION_COMPONENTS = [
    FilterComponent,
    FiltersComponent,
    ViewCollectionComponent
]

export * from './button/button.component';
export * from './button/buttons.component';
export * from './notify/notify.component';
export * from './notify/notify.model';
export * from './portrait/portrait.component';
export * from './tab/tab.component';
export * from './tab/tab-body.directive';

import { ButtonComponent } from './button/button.component';
import { ButtonsComponent } from './button/buttons.component';
import { NotifyComponent } from './notify/notify.component';
import { PortraitComponent } from './portrait/portrait.component';
import { TabComponent } from './tab/tab.component';
import { TabBodyDirective } from './tab/tab-body.directive';
export const FRAMEWORK_ALL_COMPONENTS = [
    ...INPUTS_COMPONENTS,
    ...CONTAINERS_COMPONENTS,
    ...FRAMEWORK_MODALS,
    ...COLLECTION_COMPONENTS,
    ButtonComponent,
    ButtonsComponent,
    NotifyComponent,
    PortraitComponent,
    TabComponent,
    TabBodyDirective
]