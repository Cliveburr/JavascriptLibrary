import path from "path";
import fs from 'fs';
import { INode } from "../dom";
import { GuidDictionary } from "../helpers";
import { Session } from "./session";

// export class Application {

//     public constructor(
//         private html: INode
//     ) {

//     }

//     public buildIndex(): string {

//         // const head = '<head></head>';
//         // const body = '<body>123</body>';
//         const html = this.buildNode(this.html);

//         return `<!DOCTYPE html>${html}`
//     }

//     private buildNode(node: INode): string {
//         if (node.init) {
//             node.init();
//         }
//         return node.build ?
//             node.build() :
//             '';
//     }
// }

export class Application {

    private indexTemplate?: string;
    private session: GuidDictionary<Session>;

    public constructor(
        private indexPath: string
    ) {
        this.session = new GuidDictionary<Session>(undefined, 20);
    }

    private applyScriptsOnIndex(index: string, guid: string): string {
        return index.replace('{{SCRIPTS}}',
`   <script>var guid = '${guid}';</script>
    <script type="module" src="web-socket/ws-client.js"></script>`);
    }

    private getIndex(): string {
        if (!this.indexTemplate) {
            const file = path.resolve(this.indexPath);
            this.indexTemplate = fs.readFileSync(file).toString();
        }
        return this.indexTemplate;
    }

    public buildIndex(): string {
        const guid = this.session.getFreeGuid();
        const session = new Session(guid);
        this.session.set(guid, session);

        let index = this.getIndex();
        index = this.applyScriptsOnIndex(index, guid);

        return index;
    }

    // private buildNode(node: INode): string {
    //     if (node.init) {
    //         node.init();
    //     }
    //     return node.build ?
    //         node.build() :
    //         '';
    // }
}