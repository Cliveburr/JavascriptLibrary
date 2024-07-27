

export * from './collection/card-collection.component';
export * from './collection/li/li-collection.component';
export * from './collection/filter/filters.component';
export * from './collection/filter/filter.component';
export * from './collection/table/table-collection.component';
export * from './collection/table/table-column.component';
// export * from './collection/collection-filters.component';
import { TableCollectionComponent } from './collection/table/table-collection.component';
import { TableColumnComponent } from './collection/table/table-column.component';
import { FiltersComponent } from './collection/filter/filters.component';
import { FilterComponent } from './collection/filter/filter.component';
import { LiCollectionComponent } from './collection/li/li-collection.component';
import { CardCollectionComponent } from './collection/card-collection.component';
// import { CollectionFiltersComponent } from './collection/collection-filters.component';
const COLLECTION_COMPONENTS = [
    TableCollectionComponent,
    TableColumnComponent,
    FiltersComponent,
    FilterComponent,
    LiCollectionComponent,
    CardCollectionComponent,
    // CollectionFiltersComponent
]

// export * from './inputs/collection-input/table-collection-input.component';
// export * from './inputs/collection-input/li-collection-input.component';
// export * from './inputs/collection-input/li-collection-select-modal-input.component';
// export * from './inputs/collection-input/card-collection-input.component';
// import { TableCollectionInputComponent } from './inputs/collection-input/table-collection-input.component';
// import { LiCollectionInputComponent } from './inputs/collection-input/li-collection-input.component';
// import { LiCollectionSelectModalInputComponent } from './inputs/collection-input/li-collection-select-modal-input.component';
// import { CardCollectionInputComponent } from './inputs/collection-input/card-collection-input.component';
const INPUTS_COLLECTION_COMPONENTS = [
    // TableCollectionInputComponent,
    // LiCollectionInputComponent,
    // LiCollectionSelectModalInputComponent,
    // CardCollectionInputComponent
]

//export * from './inputs/select-modal-input.component';
//export * from './inputs/modal/li-collection-modal-input.component';
//export * from './inputs/modal/portrait-modal-input.component';
//import { LiCollectionModalInputComponent } from './inputs/modal/li-collection-modal-input.component';
//import { SelectModalInputComponent } from './inputs/select-modal-input.component';
//import { PortraitModalInputComponent } from './inputs/modal/portrait-modal-input.component';
const INPUTS_MODAL_COMPONENTS = [
    // LiCollectionModalInputComponent,
    //PortraitModalInputComponent
    //SelectModalInputComponent,
]

export * from './inputs/text-input.component';
// export * from './inputs/datetime-input.component';
// export * from './inputs/number-input.component';
export * from './inputs/select-input.component';
// export * from './inputs/portrait-input.component';
// export * from './inputs/color-input.component';
// export * from './inputs/icon-input.component';
import { TextInputComponent } from './inputs/text-input.component';
// import { DatetimeInputComponent } from './inputs/datetime-input.component';
// import { NumberInputComponent } from './inputs/number-input.component';
import { SelectInputComponent } from './inputs/select-input.component';
// import { PortraitInputComponent } from './inputs/portrait-input.component';
// import { ColorInputComponent } from './inputs/color-input.component';
// import { IconInputComponent } from './inputs/icon-input.component';
export const INPUTS_COMPONENTS = [
    TextInputComponent,
    // DatetimeInputComponent,
    // NumberInputComponent,
    SelectInputComponent,
    // PortraitInputComponent,
    // ColorInputComponent,
    // IconInputComponent
]

//export * from './card/card.component';
export * from './notify/notify.component';
export * from './validators/validators.component';
// export * from './validators/meta-validators';
export * from './portrait/portrait.component';
export * from './container/container.component';
export * from './button/button.component';
export * from './button/buttons.component';
export * from './modal/modal.component';
import { CardComponent } from './card/card.component';
import { NotifyComponent } from './notify/notify.component';
import { ValidatorsComponent } from './validators/validators.component';
import { PortraitComponent } from './portrait/portrait.component';
import { ContainerComponent } from './container/container.component';
import { ButtonComponent } from './button/button.component';
import { ButtonsComponent } from './button/buttons.component';
import { ModalComponent } from './modal/modal.component';
export const FRAMEWORK_ALL_COMPONENTS = [
    ...COLLECTION_COMPONENTS,
    ...INPUTS_COMPONENTS,
    // ...INPUTS_COLLECTION_COMPONENTS,
    // ...INPUTS_MODAL_COMPONENTS,
    CardComponent,
    NotifyComponent,
    ValidatorsComponent,
    PortraitComponent,
    ContainerComponent,
    ButtonComponent,
    ButtonsComponent,
    ModalComponent
]

export * from './modal/modal.service';
import { ModalService } from './modal/modal.service';
export const FRAMEWORK_ALL_COMPONENTS_SERVICES = [
    ModalService
]