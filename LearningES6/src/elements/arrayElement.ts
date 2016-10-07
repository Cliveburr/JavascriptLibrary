import { BaseElement } from './baseElement';
import { watcher, OnChangeType } from '../system/watcher';

export class ArrayElement extends BaseElement<Array<any>> {
    private static _count: number = 0;

    public isArray: boolean;

    private _index: number;
    private _template: string;

    public createdCallback(): void {
        this.isArray = true;
        this._index = ArrayElement._count++;
        this._template = this.innerHTML;
        this.innerHTML = '';
    }

    public attachedCallback(): void {
        this.checkScope();
    }

    public onScope(data: any): void {
        if (this.model = this.getModel()) {
            if (!Array.isArray(this.model))
                `Only array can be the model of ArrayElement!`;
            this.createElements();
            watcher(this, 'model', this.onModelChange.bind(this));
        }
    }

    private createElements(): void {
        this.innerHTML = '';
        for (let it = 0; it < this.model.length; it++) {
            this.createElement(it);
        }
    }

    private createElement(id: number): void {
            let div = document.createElement('div');
            div.innerHTML = this._template;
            let childs = div.childNodes;
            for (let i = 0; i < childs.length; i++) {
                let nn = childs.item(i).cloneNode(true);
                nn['$$RID'] = id;
                this.appendChild(nn);
            }
    }

    private onModelChange(namespace: string, newValue: any, oldValue: any, type: OnChangeType): void {
        if (type == OnChangeType.add) {
            let id = this.model.length - 1;
            this.createElement(id);
        }
    }
}