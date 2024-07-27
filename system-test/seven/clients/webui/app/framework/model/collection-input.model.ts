import { ILiCollectionModalInput } from './input-modal.model';
import { IValidators } from './validators.model';

export enum CollectionItemStatus {
    pristine = 0,
    create = 1,
    update = 2,
    remove = 3
}

export interface ICollectionItem<V> {
    status?: CollectionItemStatus;
    value?: V;
}

export interface ICollectionInput {
    id?: string;
    class?: string;
    formGroup?: any;
    editGroup?: any;
    selectMode?: boolean;
    selectGroup?: any;
    selectStyle?: string;
    validators?: IValidators[];
}

export interface ILiCollectionInput<V> extends ICollectionInput {
    onAddItem?: () => V;
    onEditItem?: (item: V) => void;
}

export interface ILiCollectionSelectModalInput<V, S> extends ICollectionInput {
    onAddItem?: (selected: S) => V;
    onEditItem?: (item: V, selected: S) => void;
    modal?: ILiCollectionModalInput<S>;
}

export interface ICardCollectionInput<V> extends ICollectionInput {
    onAddItem?: () => V;
    doneAddItem?: (item: V) => void;
    onEditItem?: (item: V) => void;
    editMode?: 'inline' | 'modal';
    modalEditTitle?: string;
    hideEditButton?: boolean;
    hideExcludeButton?: boolean;
    showCancelOnEdit?: boolean;
    cardSize?: number;
}
