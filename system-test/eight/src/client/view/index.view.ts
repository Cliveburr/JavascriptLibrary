import { RouteOutlet, SNode } from "../http/index";

export class IndexView {

    private count: number = 0;

    public somelist: string[];
    public umcontent = 'veio daqui';

    public static injector = ['snode', 'html'];
    constructor(
        private snode: SNode
    ) {
        this.somelist = [
            'value 1',
            'value 2'
        ]
    }

    // public init(): Promise<void> {
    //     return this.snode.childs.set(
    //         { tag: 'h1', content: 'header' },
    //         { childs: [
    //             { tag: 'a', content: 'home', attr: [ { name: 'href', value: '/home' } ] },
    //             { tag: 'a', content: 'view', attr: [ { name: 'href', value: '/view' } ] },
    //             { childs: [
    //                 { tag: 'button', content: 'push', events: [{ name: 'click', event: this.array_push.bind(this) }] },
    //                 { tag: 'button', content: 'shift', events: [{ name: 'click', event: this.array_shift.bind(this) }] }
    //             ] },
    //             //{ tag: 'button', content: 'test2' }
    //         ]},
    //         { tag: 'br' },
    //         { tag: 'br' },
    //         { code: RouteOutlet },
    //         { tag: 'br' },
    //         { tag: 'ul' },
    //         { tag: 'h2', content: 'bottom' }
    //     );
    // }

    public array_push(): void {
        this.snode.childs.list[6]!.childs.push([{ tag: 'li', content: 'count ' + (this.count++).toString() }])
        //this.snode.childs.push({ tag: 'div', content: 'count ' + (this.count++).toString() })
    }

    public array_shift(): void {
        this.snode.childs.list[6]!.childs.shift();
    }
}