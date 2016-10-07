import { ControllerElement } from '../elements/controllerElement';
import * as Models from '../elements/models';

export interface IMenuModel {
    oneText: Models.ISpanModel;
    oItems: Array<IMenuOitems>;
    items: Array<Models.ILinkModel>;
}

export interface IMenuOitems {
    text: Models.ISpanModel;
}

export default class Menu {

    public constructor(
        public ctr: ControllerElement) {
        ctr.scopeInitialize();
        setTimeout(this.load.bind(this), 100);
    }

    private load(): void {
        let model: IMenuModel = {
            oneText: {
                text: 'oneText label'
            },
            oItems: [
                { text: { text: 'oItem text 0' } },
                { text: { text: 'oItem text 1' } },
                { text: { text: 'oItem text 2' } },
                { text: { text: 'oItem text 3' } }
            ],
            items: [
                { text: 'Home', url: '/home' },
                { text: 'Customer', url: '/customer' },
                { text: 'About', url: '/home/about' }
            ]
        };
        this.ctr.setScope(model);
    }
}