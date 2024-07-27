import { Injectable, TemplateRef } from '@angular/core';
import { ModalComponent } from './modal.component';

@Injectable()
export class ModalService {

    private comp: ModalComponent;
    
    public setComponent(comp: ModalComponent): void {
        this.comp = comp;
    }

    public show(): void {
        // this.comp.textTitle = 'testando';
        // this.comp.closeButtonOnHeader = false;
        // this.comp.config = {
        //     //backdrop: 'static'
        // }
        // this.comp.scrollable = true;
        // this.comp.modal.show();
    }

    public showAsSelect(title: string, body: TemplateRef<any>, e: (v: null) => void): void {
        this.comp.show({
            title,
            body,
            onHideExec: e
        });
    }

    public showAsQuestion(title: string, body: TemplateRef<any>, footer: TemplateRef<any>, e: (v: null) => void): void {
        this.comp.show({
            title,
            body,
            footer,
            onHideExec: e
        });
    }

    public hide(): void {
        this.comp.hide();
    }
}