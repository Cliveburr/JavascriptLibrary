import { IScopeable, Scope } from '../binding/scope';
import { IControllable, ControllerManager } from '../binding/controller';

export class DivElement extends HTMLElement implements IScopeable, IControllable {
    //public isScope: boolean;
    public scope: Scope;
    public ctr: any;

    public createdCallback() {
        ControllerManager.checkAndInstance(this);
    }

    public initializeScope(): void {
        //this.isScope = true;
        this.scope = new Scope(this);
    }

    // private initilize(): void {
    //     let links = this.getElementsByTagName('nt-link');
    //     for (let i = 0; i < links.length; i++) {
    //         let a = links.item(i) as LinkElement;
    //         a.ntOnClick = (ev: MouseEvent): void => {
    //             Program.navigate.to(a.href);
    //         };
    //     }
    // }
}