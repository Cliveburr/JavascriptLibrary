
export interface SecurityModel {
    [name: string]: SecurityModel | SecurityModelSet;
}

export interface SecurityModelSet {
    key: number;
    default: boolean;
}