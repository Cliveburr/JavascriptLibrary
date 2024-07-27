
export enum ILoaderFilterType {
    Equality = 0,
    Regex = 1,
    ObjectId = 2,
    Contains = 3,
    ContainsObjectId = 4
}

export interface ILoaderFilter {
    type?: ILoaderFilterType;
    property?: string;
    code: string;
    value: any;
    regexPattern?: string;
    regexFlags?: string;
    inverse?: boolean;
}

export interface ILoaderApplyFilter {
    apply(item: any): boolean;
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

export interface ILoaderResponse {
    items: any[];
    total?: number;
}

export interface ILoaderApi {
    (request: ILoaderRequest): Promise<ILoaderResponse>;
}

export interface ILoaderContent {
    get(request: ILoaderRequest): Promise<ILoaderResponse>;
}

export interface ILoaderModel {
    staticItems?: any[];
    apiItems?: (request: ILoaderRequest) => Promise<ILoaderResponse>;
}
