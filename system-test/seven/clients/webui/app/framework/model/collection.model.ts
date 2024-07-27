import { ILoaderFilter, ILoaderModel } from '../loadercontent';
import { ComponentItemBase, ValueFormated } from './component.model';

export enum FilterItemType {
    automatic = 0,
    text = 1,
    select = 2
}

export interface IFilterItem {
    type: FilterItemType;
    alias?: string;
    placeholder?: string;
    size?: number;
    timeout?: number;
    loader: ILoaderFilter;
    onRequest?: (value: any) => any;
}

export interface IFilterCollection {
    cardTitle?: string;
    filters?: IFilterItem[];
}

export enum ButtonItemType {
    normal = 0,
    single = 1,
    multi = 2
}

export interface IButtonItem {
    name: string;
    type: ButtonItemType;
    event: string;
    style?: string;
    disabled?: boolean;
    icon?: string;
}

export interface IButtonCollection {
    host: any;
    buttons: IButtonItem[];
}

export interface ICollection extends ILoaderModel {
    pageLimit?: number;
    filter?: IFilterCollection;
}

export interface ILiCollection<V> extends ICollection {
    firstItems?: V[];
    dontRefresheAtStart?: boolean;
    displayProp?: string;
    selectMode?: boolean;
    selected?: V;
}

export interface ICardCollection<V> extends ICollection {
    firstItems?: V[];
    dontRefresheAtStart?: boolean;
    button?: IButtonCollection;
    cardSize?: number;
}







/* remover apos alterar todo os componentes para o formato novo */
export interface TableCollectionColumn extends ValueFormated {
    header: string;
    property: string;
    class?: string;
}

export interface TableCollectionItem<T> extends ComponentItemBase<T> {
    openEditor?: boolean;
}

export interface TableCollectionData<T> extends ComponentItemBase<TableCollectionItem<T>[]> {
    class?: string;
    columns: TableCollectionColumn[];
    onAddItem: () => T;
}
