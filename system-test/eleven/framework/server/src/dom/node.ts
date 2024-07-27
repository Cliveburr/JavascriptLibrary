import { INode } from "./model";

export class Node implements INode {

    public childs?: INode[];
    public attributes?: { [name: string]: string | null };
    public innerText?: string;
    public selfClose?: boolean;

    public constructor(
        public tag: string
    ) {
    }

    public init(): void {

    }

    public build(): string {
        const attrs = this.buildAttrs();
        if (this.selfClose) {
            if (this.childs || this.innerText) {
                throw `Tag: \'${this.tag}\' self closed cannot has childs or innerText!`;
            }
            return `<${this.tag}${attrs}/>`;
        }
        else {
            if (this.childs && this.innerText) {
                throw `Tag: \'${this.tag}\' has childs and innerText!`;
            }
            else if (this.childs) {
                const contents: string[] = [];
                for (let child of this.childs) {
                    if (child.build) {
                        contents.push(child.build());
                    }
                }
                const innerHtml = contents
                    .join('');
                return `<${this.tag}${attrs}>${innerHtml}</${this.tag}>`
            }
            else {
                return `<${this.tag}${attrs}>${this.innerText}</${this.tag}>`
            }
        }
    }

    private buildAttrs(): string {
        if (this.attributes) {
            const attrSingls = Object.getOwnPropertyNames(this.attributes)
                .map(a => `${a}=\"${this.attributes![a]}\"`)
            return ' ' + attrSingls.join(' ');
        }
        else {
            return '';
        }
    }
}

export function N(arg: {
    tag: string,
    childs?: INode[],
    attributes?: { [name: string]: string | null },
    innerText?: string,
    selfClose?: boolean
}): INode {
    const node = new Node(arg.tag);
    node.childs = arg.childs;
    node.attributes = arg.attributes;
    node.innerText = arg.innerText;
    node.selfClose = arg.selfClose;
    return node;
}