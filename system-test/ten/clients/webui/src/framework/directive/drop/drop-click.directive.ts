import { Directive, ElementRef, HostListener } from "@angular/core";
import { DropDirective } from "./drop.directive";

@Directive({
    selector: '[t-drop-click]'
})
export class DropClickDirective {

    public el: HTMLElement;
    public onWindowClickBind: any;

    private drop?: DropDirective;

    public constructor(
        elementRef: ElementRef
    ) {
        this.el = elementRef.nativeElement;
        this.onWindowClickBind = this.onWindowClick.bind(this);
    }

    public setDrop(drop: DropDirective): void {
        this.drop = drop;
    }

    @HostListener('click', ['$event'])
    public onHostClick(event: MouseEvent): void {
        if (this.drop && !this.drop.isActive) {
            window.addEventListener('click', this.onWindowClickBind);
            event.cancelBubble = true;
            this.drop.show();
        }
    }

    public onWindowClick(event: MouseEvent) {
        if (this.drop && this.drop.isActive) {
            this.drop.close();
        }
    }
}