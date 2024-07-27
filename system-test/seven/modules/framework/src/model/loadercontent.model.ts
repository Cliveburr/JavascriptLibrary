import { ObjectID } from "bson";

export enum ILoaderFilterType {
    Equality = 0,
    Regex = 1,
    ObjectId = 2,
    Contains = 3,
    ContainsObjectId = 4
}

export interface ILoaderFilter {
    type: ILoaderFilterType;
    property?: string;
    code?: string;
    value?: any;
    regexPattern?: string;
    regexFlags?: string;
    inverse?: boolean;
}

export interface ILoaderOrder {
    property: string;
    asc: boolean
}

export interface ILoaderRequest {
    pos: number;
    count: number;
    filters?: ILoaderFilter[];
    order?: ILoaderOrder;
    withTotal?: boolean;
}

export interface ILoaderResponse<T> {
    items: T[];
    total?: number;
}

export interface ISelectResponse {
    _id: ObjectID;
    name: string;
}