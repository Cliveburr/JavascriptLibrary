import { SNode } from "../http/index";

export class ViewCode {

    public static injector = ['snode'];
    constructor(
        private snode: SNode
    ) {
    }

    public init(): void {
        this.snode.setContent('teste123');
    }
}