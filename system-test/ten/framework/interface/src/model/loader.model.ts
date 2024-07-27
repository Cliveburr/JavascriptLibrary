
export enum ILoaderFilterType {
    Equality = 0,
    Regex = 1,
    ObjectId = 2,
    Contains = 3,
    ContainsObjectId = 4
}

export interface ILoaderFilter {
    type: ILoaderFilterType;
    property: string;
    code: number;
    regexPattern?: string;
    regexFlags?: string;
    inverse?: boolean;
}

export interface ILoaderRequestFilter {
    code: number;
    value: any;
}

export interface ILoaderOrder {
    property: string;
    code: number;
    request?: ILoaderRequestOrder;
}

export interface ILoaderRequestOrder {
    code: number;
    asc: boolean;
}

export interface ILoaderRequest {
    pos: number;
    count: number;
    filters?: ILoaderRequestFilter[];
    order?: ILoaderRequestOrder;
    withTotal?: boolean;
}

export interface ILoaderResponse<T> {
    items: T[];
    total?: number;
}

export interface ILoader<T> {
    (request: ILoaderRequest): Promise<ILoaderResponse<T>>;
}