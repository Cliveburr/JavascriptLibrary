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

    public createdCallback(): void {
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
        let nName: IHomeItemModel = {
            sp: {
                text: Observer(this.model.btOne.value),
                onclick: () => this.sp_onclick2(nName)
                //this.sp_onclick.bind(this)
            }
        };
        this.model.names.push(nName);
    }

    private sp_onclick2(item: IHomeItemModel): void {
        let h = this.model.names.indexOf(item);
        let nName: IHomeItemModel = {
            sp: {
                text: '-- insert --'
            }
        };        
        this.model.names.insert(h, nName);
    }

    private sp_onclick(model: Models.ISpanModel): void {
        //let tx = model.text as IObserver<string>;
        //tx(tx() + '-1-');
        //this.model.names.remove(model.parent);
    }
}

console.log('home');