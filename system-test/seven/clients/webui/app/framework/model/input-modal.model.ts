import { ILiCollection } from './collection.model';
import { IPortraitInput } from './input.model';

export interface IModalInput {
    modalTitle?: string;
}

export interface ILiCollectionModalInput<V> extends IModalInput {
    collection?: ILiCollection<V>;
}

export interface ISelectModalInput<T> extends IModalInput {
    displayProp?: string;
    collection?: ILiCollection<T>;
}

export interface IPortraitModalInput extends IModalInput, IPortraitInput {
}