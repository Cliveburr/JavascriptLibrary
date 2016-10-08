import { ViewBase } from '../viewBase';
import * as Models from '../../elements/models';
import { IObserver, Observer, IObserverArray, ObserverArray } from '../../system/observer';

export interface IHomeModel {
    btOne: Models.IInputModel;
    action: Models.IButtonModel;
    names: IObserverArray<IHomeItemModel>;
}

export interface IHomeItemModel {
    sp: Models.ISpanModel;
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
            names: ObserverArray([])
        });
    }

    private action_onclick(ev: MouseEvent): void {
        //alert(this.model.btOne.value);
        this.model.names.push({
            sp: {
                text: Observer(this.model.btOne.value),
                onclick: this.sp_onclick.bind(this)
            }
        });
    }

    private sp_onclick(model: Models.ISpanModel): void {
        let tx = model.text as IObserver<string>;
        tx(tx() + '-1-');
        //this.model.names.pop();
    }
}

console.log('home');