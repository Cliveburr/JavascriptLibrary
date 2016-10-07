import { ViewElement } from '../elements/viewElement';

export abstract class ViewBase<T> {
    private _model: T;

    public abstract attachedCallback(): void;

    public get model(): T { return this._model }

    public setModel(scope: T): void {
        let views = document.getElementsByTagName('nt-view');
        if (views.length != 1)
            throw 'Invalid numbers of nt-view!';
        let view = views.item(0) as ViewElement;
        view.setScope(scope);
        this._model = scope;
    }
}