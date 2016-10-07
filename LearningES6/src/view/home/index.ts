import { ViewBase } from '../viewBase';
import * as Models from '../../elements/models';

export interface IHomeModel {
    btOne: Models.IInputModel;
    action: Models.IButtonModel;
    names: Array<Models.ISpanModel>;
}

export default class HomeIndex extends ViewBase<IHomeModel> {
    public constructor() {
        super();
    }

    public attachedCallback(): void {
        this.setModel({
            btOne: {
                text: 'Name:',
                placeholder: 'testing...'
            },
            action: {
                text: 'clica',
                onclick: this.action_onclick.bind(this) 
            },
            names: []
        });
    }

    private action_onclick(ev: MouseEvent): void {
        //alert(this.model.btOne.value);
        this.model.names.push({
            text: this.model.btOne.value
        });
    }
}

console.log('home');