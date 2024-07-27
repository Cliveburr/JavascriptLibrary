import { IProvider } from "../provider";

export interface ITag {
    tag: string;
    cls: any;
}

export class TagProvider implements IProvider<any> {

    public constructor(
        public tags: ITag[]
    ) {
    }

    public async resolve(key: any): Promise<any> {
        for (const tag of this.tags) {
            if (tag.tag == key) {
                return tag.cls;
            }
        }
    }
}