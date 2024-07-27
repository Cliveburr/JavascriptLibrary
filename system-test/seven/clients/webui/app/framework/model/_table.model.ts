import { ValueFormated } from './component.model';
import { ILoaderFilter, ILoaderRequest, ILoaderResponse } from './loadercontent.model';

export interface ITableColumn extends ValueFormated {
    header: string;
    property: string;
    canOrder?: boolean;
}

export enum TableFilterType {
    automatic = 0,
    text = 1,
    select = 2
}

export interface ITableFilter {
    type: TableFilterType;
    alias?: string;
    size?: number;
    timeout?: number;
    loader: ILoaderFilter;
}

export enum ActiveButtonType {
    normal = 0,
    single = 1,
    multi = 2
}

export interface ITableButton {
    name: string;
    active: ActiveButtonType;
    event: string;
    style?: string;
    disabled?: boolean;
    icon?: string;
}

export interface ITableData {
    host?: any;
    dontRefresheMe?: boolean;
    cols: ITableColumn[];
    filters?: ITableFilter[];
    buttons?: ITableButton[];
    staticItems?: any[];
    apiItems?: (request: ILoaderRequest) => Promise<ILoaderResponse>;
    firstLoad?: ILoaderResponse;
}