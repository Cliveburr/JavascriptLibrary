import { Component } from '@angular/core';
import { BaseService, ModalBase, ModalData } from 'src/framework';

@Component({
    templateUrl: 'security-modal.component.html'
})
export class SecurityModalComponent implements ModalBase {

    public modalData!: ModalData;

    public constructor(
        public base: BaseService
    ) {
    }
    
    public initializeAsync(modalData: ModalData): Promise<void> {
        this.modalData = modalData;
        return new Promise((exec, rej) => {
            setTimeout(() => {
                exec();
            }, 300000);
        });
    }

    public cancel(): void {
        this.modalData.hide!();
        if (this.modalData.exec) {
            this.modalData.exec();
        }
    }

    public confirm(): void {
    }
}