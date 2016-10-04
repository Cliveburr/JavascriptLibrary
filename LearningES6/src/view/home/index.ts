import { Scope } from '../../binding/scope';
import * as emodels from '../../elements/models';

export interface IHomeModel {
    btOne: emodels.IInputModel;
    action: emodels.IButtonModel
}

export default class HomeIndex {
    public scope: Scope;

    public constructor() {
        let view = document.getElementsByTagName('nt-view');
        this.scope = new Scope(view.item(0));
        //setTimeout(this.load.bind(this), 100);
    }

    private onLoad(): void {
        this.scope.set({
            btnOne: {
                label: 'Name:',
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
        //alert(this.scope.data.btnOne.value);
        this.scope.data.names.push({
            label: this.scope.data.btnOne.value
        });
    }
}

console.log('home');