import { BaseElement } from './baseElement';
import { IObserverArray, OnChangeType } from '../system/observer';

export class ArrayElement extends BaseElement<Array<any> | IObserverArray<any>> {
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
        if (!this.model)
            this.checkScope();
    }

    public onScope(data: any): void {
        if (this.model = this.getModel()) {
            if (this.isObserverArray(this.model)) {
                this.model.on(this.onModelChange.bind(this));
            }
            else {
                if (!Array.isArray(this.model))
                    throw `Only array can be the model of ArrayElement!`;
            }
            this.createElements();
        }
    }

    private createElements(): void {
        this.innerHTML = '';
        for (let it = 0; it < this.model.length; it++) {
            this.appendElement(it);
        }
    }

    private appendElement(id: number): void {
        let div = document.createElement('div');
        div.innerHTML = this._template;
        let childs = div.childNodes;
        for (let i = 0; i < childs.length; i++) {
            let nn = childs.item(i).cloneNode(true);
            nn['$$RID'] = id;
            this.appendChild(nn);
        }
    }

    private removeElement(id: number): void {
        let fd = 0;
        for (let i = 0; i < this.childNodes.length; i++) {
            let nn = this.childNodes.item(i);
            let rid = nn['$$RID'];
            if (fd == 0) {
                if (rid == id) {
                    this.removeChild(nn);
                    fd = 1;
                    i--;
                }
            }
            else if (fd == 1) {
                if (rid == id) {
                    this.removeChild(nn);
                    i--;
                }
                else {
                    nn['$$RID'] = --rid;
                    fd = 2;
                }
            }
            else {
                nn['$$RID'] = --rid;
            }
        }
    }

    private insertElement(id: number): void {
        let fd = true;
        for (let i = 0; i < this.childNodes.length; i++) {
            let oc = this.childNodes.item(i);
            let rid = oc['$$RID'];
            if (fd) {
                if (rid == id) {
                    oc['$$RID'] = ++rid;
                    let childs = this.generateChilds();
                    for (let ci = 0; ci < childs.length; ci++) {
                        let nn = childs.item(ci).cloneNode(true);
                        nn['$$RID'] = id;
                        this.insertBefore(nn, oc);
                        i++;
                    }
                    fd = false;
                }
            }
            else {
                oc['$$RID'] = ++rid;
            }
        }
        if (fd) {
            this.appendElement(id);
        }
    }

    private generateChilds(): NodeList {
        let div = document.createElement('div');
        div.innerHTML = this._template;
        return div.childNodes;
    }

    private onModelChange(v: Array<any>, index: number, type: OnChangeType): void {
        let m = this.model as IObserverArray<any>;
        if (type == OnChangeType.add) {
            this.insertElement(index);
        }
        else if (type == OnChangeType.remove) {
            this.removeElement(index);
        }
        else {
            this.removeElement(index);
            this.insertElement(index);
        }
    }
}