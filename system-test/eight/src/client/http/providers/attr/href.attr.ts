import { ISAttribute } from "../../dom/models";
import { SNode } from "../../dom/snode";
import { AttrResolver } from "./attr.provider";

export class HrefAttr implements AttrResolver {
    
    public build(snode: SNode, attr: ISAttribute): ISAttribute | undefined {
        snode.events.push([{ name: 'click', event: this.href_click.bind(this, attr.value) }])
        return attr;
    }

    private href_click(value: string | null | undefined, ev: Event): void {
        if (value) {
            ev.preventDefault();
            window.sdom!.router.navigate(value);
        }
    }
}