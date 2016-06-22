
module app.Elements {
    export class Button implements DynamicTag.IController {
        public onRender(nodes: NodeList, render: (nodes: NodeList) => void): void {
            render(nodes);
        }
    }
}