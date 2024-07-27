import { Component } from "@angular/core";
import { ModalData } from "src/framework/service";
import { ModalBase } from "../modal-base";

@Component({
    templateUrl: 'modal-message.component.html'
})
export class MessageModalComponent implements ModalBase {
    
    public modalData!: ModalData;
    public title?: string;
    public message?: string;
    
    public initialize(modalData: ModalData): void {
        this.modalData = modalData;
        this.title = modalData.data.title;
        this.message = modalData.data.message;
    }

    public close(): void {
        this.modalData.hide!();
        if (this.modalData.exec) {
            this.modalData.exec();
        }
    }
}