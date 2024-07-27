import { ILoaderFilter, ILoaderRequest, ILoaderResponse } from './loadercontent.model';

export enum TableIVFilterType {
    automatic = 0,
    text = 1,
    select = 2
}

export interface IInfiniteViewFilter {
    type: TableIVFilterType;
    alias?: string;
    size?: number;
    timeout?: number;
    loader: ILoaderFilter;
}

export interface IInfiniteViewButton {
    name: string;
    event: string;
    style?: string;
    disabled?: boolean;
    icon?: string;
}

export interface IInfiniteViewData<T> {
    host?: any;
    dontRefresheMe?: boolean;
    //cols: ITableColumn[];
    filters?: IInfiniteViewFilter[];
    buttons?: IInfiniteViewButton[];
    staticItems?: any[];
    apiItems?: (request: ILoaderRequest) => Promise<ILoaderResponse>;
}