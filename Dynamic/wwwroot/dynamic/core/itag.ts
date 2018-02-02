
export interface ITag {
    test(tagName: string): boolean;
    define(tag: any): void;
}

export interface ITagType {
    new (): ITag;
}