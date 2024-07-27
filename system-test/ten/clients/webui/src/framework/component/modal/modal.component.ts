import { Component, ComponentRef, HostBinding, HostListener, ViewChild, ViewContainerRef } from "@angular/core";
import { ModalData, ModalService } from "src/framework";
import { ModalBase } from "./modal-base";

@Component({
    selector: 't-modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['modal.component.scss']
})
export class ModalComponent {

    @ViewChild('contentRef', { read: ViewContainerRef, static: true }) contentRef?: ViewContainerRef;
    @HostBinding('class') hostClass?: string;

    private showingData?: ModalData;
    private componentRef?: ComponentRef<ModalBase>;

    public constructor(
        modalService: ModalService
    ) {
        modalService.showModal.subscribe(this.modalService_showModal.bind(this));
    }

    private modalService_showModal(modalData: ModalData): void {
        if (this.showingData) {
            throw 'Cascate modal is not allowed!';
        }

        if (!this.contentRef) {
            throw 'ModalComponent ViewContainerRef fail to initialize!';
        }

        this.showingData = modalData;
        this.componentRef = this.contentRef.createComponent(modalData.content);
        modalData.hide = this.unloadAndHide.bind(this);
        if (this.componentRef.instance.initializeAsync) {
            this.componentRef.instance.initializeAsync(modalData)
                .catch(this.unloadAndHide.bind(this))
                .finally(() => {
                    if (this.hostClass == 'loading') {
                        this.hostClass = 'show';
                    }
                });
            this.hostClass = 'loading';
        }
        else if (this.componentRef.instance.initialize) {
            this.componentRef.instance.initialize(modalData);
            this.hostClass = 'show';
        }
        else {
            throw 'Modal component invalid! ' + modalData.content;
        }
    }

    private unloadAndHide(): void {
        this.contentRef!.remove();
        this.hostClass = '';
        delete this.showingData;
    }

    @HostListener('click', ['$event'])
    public onClick(event: any) {
        if (this.showingData && (event.target.tagName == 'T-MODAL' && !this.showingData.fixedClosed)) {
            const exec = this.showingData.exec;
            this.unloadAndHide();
            if (exec) {
                exec();
            }
        }
    }
}