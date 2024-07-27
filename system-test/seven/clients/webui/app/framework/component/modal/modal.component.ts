import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalService } from './modal.service';

export interface IModalModel {
    config?: ModalOptions;
    scrollable?: boolean;
    closeButtonOnHeader?: boolean;
    onHideExec?: (v: null) => void;
    title?: string;
    body: TemplateRef<any>;
    footer?: TemplateRef<any>;
}

@Component({
    selector: 'modal',
    templateUrl: 'modal.component.html'
})
export class ModalComponent {
    
    @ViewChild('bodyRef', { read: ViewContainerRef, static: false }) public bodyRef: ViewContainerRef;
    public model?: IModalModel;
    private inModal?: ModalDirective;

    public constructor(
        modalService: ModalService
    ) {
        modalService.setComponent(this);
    }

    @ViewChild('modal') public set modal(element: ModalDirective) {
        this.inModal = element;
        if (this.model && this.inModal)  {
            this.inModal.show();
        }
    }

    public show(model: IModalModel): void {
        model.config ||= {};
        model.scrollable ||= false;
        model.closeButtonOnHeader ||= true;
        this.model = model;
        //this.bodyRef.createEmbeddedView(model.body);
    }

    public hide(): void {
        if (this.model) {
            this.model.onHideExec = undefined;
        }
        if (this.inModal) {
            this.inModal.hide();
        }
    }

    public onHide(): void {
        if (this.model && this.model.onHideExec) {
            this.model.onHideExec(null);
        }
        //this.bodyRef.clear();
        this.model = undefined;
    }
}