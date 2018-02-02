
module app.Elements {
    export class Button implements DynamicTag.IController {
        constructor() {
            var some = 3345;
        }

        public onRender(nodes: NodeList, render: (nodes: NodeList) => void): void {
            let button = <HTMLButtonElement>nodes.item(0);

            console.log('hit');
            button.onclick = (ev) => {
                alert('works 2334 teste');
            };
            button.value += '@##@';

            render(nodes);
        }
    }
}