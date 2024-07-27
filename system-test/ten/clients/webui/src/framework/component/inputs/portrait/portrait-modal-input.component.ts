import { Component } from "@angular/core";
import { PortraitModel } from "../../../interface.index";
import { ModalData, ModalBase } from "src/framework";

@Component({
    templateUrl: 'portrait-modal-input.component.html'
})
export class PortraitModalInputComponent implements ModalBase {
    
    public modalData!: ModalData;
    public title?: string;
    public value?: PortraitModel;
    
    public initialize(modalData: ModalData): void {
        this.modalData = modalData;
        this.title = modalData.data.title;
        this.value = modalData.data.value;
    }

    public cancel(): void {
        this.modalData.hide!();
        if (this.modalData.exec) {
            this.modalData.exec(null);
        }
    }

    public confirm(): void {
        this.modalData.hide!();
        if (this.modalData.exec) {
            this.modalData.exec(this.value);
        }
    }
}