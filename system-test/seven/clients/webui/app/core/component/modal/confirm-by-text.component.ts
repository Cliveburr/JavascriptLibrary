import { Component, TemplateRef, ViewChild } from "@angular/core";
import { ILoaderFilter, ModalService } from "app/framework";

@Component({
    selector: 's-confirm-by-text',
    templateUrl: 'confirm-by-text.component.html'
})
export class ConfirmByTextComponent {

    @ViewChild('modalBody') public modalBody: TemplateRef<any>;
    @ViewChild('modalFooter') public modalFooter: TemplateRef<any>;
    private result?: (value: boolean | null) => void;
    public message: string;
    public text: string;
    public textEntered: string;
    public btnConfirmDisabled: boolean;

    public constructor(
        private modalService: ModalService
    ) {
        this.btnConfirmDisabled = true;
    }

    public async confirm(title: string, text: string, message: string): Promise<boolean | null> {
        this.message = message;
        this.text = text;
        this.textEntered = '';
        return new Promise((e, r) => {
            this.result = e;
            this.modalService.showAsQuestion(title, this.modalBody, this.modalFooter, e);
        });      
    }

    public btn_confirm(): void {
        if (this.result) {
            this.result(this.text == this.textEntered);
        }
        this.modalService.hide();
    }

    public onKeyUp(): void {
        this.btnConfirmDisabled = this.text != this.textEntered;
        console.log(this.btnConfirmDisabled, this.text, this.textEntered)
    }
}