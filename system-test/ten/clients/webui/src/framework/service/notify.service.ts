import { Injectable } from '@angular/core';
import { NotifyComponent, NotifyMessage, NotifyType } from '../component';

@Injectable()
export class NotifyService {

    public static StaticComponent: NotifyComponent | null;

    public setComponent(component: NotifyComponent): void {
        if (!NotifyService.StaticComponent) {
            NotifyService.StaticComponent = component;
        }
    }

    public addNotify(type: NotifyType, content: string, timeout?: number): void {
        if (NotifyService.StaticComponent) {
            NotifyService.StaticComponent.addNotify({ type, content, timeout });
        }
    }
}
