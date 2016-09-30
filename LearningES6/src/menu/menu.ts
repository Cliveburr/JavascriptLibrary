import { DivElement } from '../elements/divElement';

export default class Menu {

    public constructor(
        public div: DivElement) {
        //alert('foi');

        div.initializeScope();

        setTimeout(this.load.bind(this), 100);
        //setTimeout(this.load2.bind(this), 4000);

    }

    private load(): void {
        this.div.scope.set({
            name: 'euuuuuu',
            address: 'uma rua qualquer',
            number: 1234,
            childs: [
                { something: 1234 }
            ],
            link1: 'home',
            link2: 'customer',
            link3: 'home/about'
        });
        //this.initilize();
    }

    private load2(): void {
        this.div.scope.set({
            name: 'mudeiiiiiiiiiiii',
            address: 'uma rua qualquer',
            number: 1234,
            childs: [
                { something: 1234 }
            ],
            link1: 'home'
        });
    }
}