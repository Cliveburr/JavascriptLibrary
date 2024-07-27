import { SNode } from "../http/index";

export class HomeCode {

    public static injector = ['snode', 'html'];
    constructor(
        private snode: SNode
    ) {
        //const snodeStruct = MSBlobBuilder.build(html);
        //snode.childs.set(snodeStruct)
    }

    // public init(): void {
    //     this.snode.setContent('esse é o conteudo da home!');
    // }
}