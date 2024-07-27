import { EventEmitter, Injectable, Injector, Type } from '@angular/core';
import { PortraitModalInputComponent, MessageModalComponent, ModalBase } from '../component';
import { SECURITY_MODAL } from '../helpers';
import { PortraitModel } from '../interface.index';

export interface ModalData {
    content: Type<ModalBase>;
    fixedClosed?: boolean;
    data: any;
    exec?: (value?: any) => void;
    rej?: (error?: any) => void;
    hide?: () => void;
}

@Injectable()
export class ModalService {

    public showModal = new EventEmitter<ModalData>()

    public constructor(
        private injector: Injector
    ) {
    }

    public async message(title: string, message: string): Promise<void> {
        return new Promise((exec, rej) => {
            this.showModal.emit({
                content: MessageModalComponent,
                data: {
                    title,
                    message
                },
                exec,
                rej
            })
        });
    }

    public async portrait(title: string, value: PortraitModel): Promise<PortraitModel | null> {
        return new Promise((exec, rej) => {
            this.showModal.emit({
                content: PortraitModalInputComponent,
                data: {
                    title,
                    value
                },
                exec,
                rej
            })
        });
    }

    public security(security?: string): void {
        const component = this.injector.get(SECURITY_MODAL);
        this.showModal.emit({
            content: component,
            data: {
                security
            }
        });
    }
}
