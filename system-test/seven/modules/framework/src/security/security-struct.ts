
export interface SecurityStruct {
    [name: string]: SecurityStruct | SecurityStructSet;
}

export interface SecurityStructSet {
    key: number;
    default: boolean;
}