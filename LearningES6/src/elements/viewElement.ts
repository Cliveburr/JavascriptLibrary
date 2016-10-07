import { BaseElement } from './baseElement';

export class ViewElement extends BaseElement<null> {
    public createdCallback(): void {
        this.scopeInitialize();
    }
}