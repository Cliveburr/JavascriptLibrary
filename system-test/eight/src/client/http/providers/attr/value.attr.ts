import { SData } from "../../data/sdata";
import { ISAttribute } from "../../dom/models";
import { SNode } from "../../dom/snode";
import { AttrResolver } from "./attr.provider";

export class ValueAttr implements AttrResolver {
    
    private data?: SData;
    private ns?: string;

    public build(snode: SNode, attr: ISAttribute): ISAttribute | undefined {
        this.data = snode.getDataContext();
        this.ns = attr.value!;
        snode.events.push([
            { name: 'keyup', event: this.context_change.bind(this) }
        ]);
        if (this.data) {
            const value = this.data.get(this.ns);
            snode.props.set('value', value);
        }
        return undefined;
    }

    private context_change(ev: KeyboardEvent): void {
        const value = (<HTMLInputElement>ev.target).value;
        if (this.data) {
            this.data.set(value, this.ns);
        }
    }
}