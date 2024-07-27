import { Injectable } from '@angular/core';
import { NotifyComponent } from '../component';
import { NotifyType, NotifyMessage } from '../model';

@Injectable()
export class NotifyService {

    public static StaticComponent: NotifyComponent | null;

    public setComponent(component: NotifyComponent): void {
        if (NotifyService.StaticComponent) {
            throw 'Only one modal component can be exist!';
        }
        NotifyService.StaticComponent = component;
    }

    public addNotify(type: NotifyType, text: string, timeout?: number): void {
        if (NotifyService.StaticComponent) {
            NotifyService.StaticComponent.addNotify(new NotifyMessage(type, text, timeout));
        }
    }
}
