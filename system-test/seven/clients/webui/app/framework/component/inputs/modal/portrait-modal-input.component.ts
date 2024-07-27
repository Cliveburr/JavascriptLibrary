import { Component, OnInit, ViewChild } from '@angular/core';
import { PortraitModel, IPortraitModalInput, PortraitType } from '../../../model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BaseModalInputComponent } from './base-modal-input';

@Component({
    selector: 's-portrait-modal-input',
    templateUrl: 'portrait-modal-input.component.html'
})
export class PortraitModalInputComponent extends BaseModalInputComponent<PortraitModel, IPortraitModalInput> implements OnInit {
    
    //@HostBinding('class') public hostClass: string;
    @ViewChild('modal') public modal: ModalDirective;
    private execPromise?: (value: PortraitModel | undefined) => void;

    public constructor() {
        super();
        this.disfirnull = true;
    }

    public ngOnInit(): void {
        this.prepareMeta();
    }

    protected prepareMeta(): void {
        //this.hostClass = 'border border-secondary bg-light ' + this.meta.class;
    }

    public show(portrait: PortraitModel): Promise<PortraitModel | undefined> {
        this.value = portrait;
        return new Promise<PortraitModel>((e, r) => {
            this.execPromise = <any>e;
            this.modal.show();
        });
    }

    public close(): void {
        this.modal.hide();
    }

    public confirm_click(): void {
        this.modal.hide();
        const stripedModel = this.stripModel(this.value);
        this.execPromise!(stripedModel);
    }

    public inModalHidden(): void {
        if (this.execPromise) {
            this.execPromise(undefined);
        }
    }

    public stripModel(model: PortraitModel): PortraitModel {
        const stripedModel = <any>{
            type: model.type
        }
        switch (model.type) {
            case PortraitType.TwoLetter: {
                stripedModel.twoLetter = model.twoLetter;
                break;
            }
            case PortraitType.Icon: {
                stripedModel.icon = model.icon;
                break;
            }
        }
        return stripedModel;
    }
}