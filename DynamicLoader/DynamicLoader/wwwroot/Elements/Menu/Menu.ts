
module app.Elements {
    export class Menu implements DynamicTag.IController {
        public onRender(nodes: NodeList, render: (nodes: NodeList) => void): void {

            render(nodes);
        }
    }
}