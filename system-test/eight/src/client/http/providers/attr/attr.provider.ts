import { ISAttribute } from "../../dom/models";
import { SNode } from "../../dom/snode";
import { IProvider } from "../provider";
import { ForAttr } from "./for.attr";
import { HrefAttr } from "./href.attr";
import { ValueAttr } from "./value.attr";

export interface AttrResolver {
    build(snode: SNode, attr: ISAttribute): ISAttribute | undefined;
}

export class AttrProvider implements IProvider<AttrResolver> {

    private returnSingleton(cls: any): any {
        if (!cls._singleton) {
            cls._singleton = new cls();
        }
        return cls._singleton;
    }

    public async resolve(key: any): Promise<any> {
        switch (key) {
            case 'href': return this.returnSingleton(HrefAttr);
            case '[value]': return this.returnSingleton(ValueAttr);
            case '*sFor': return this.returnSingleton(ForAttr);
        }
    }
}