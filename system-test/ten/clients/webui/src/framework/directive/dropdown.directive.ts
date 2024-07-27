import { Directive, ElementRef, HostListener, Renderer2 } from "@angular/core";

@Directive({
    selector: '[dropdown]'
})
export class DropdownDirective {

    private isActive: boolean;

    public constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) {
        this.isActive = false;
        this.renderer.listen('window', 'click', this.onWindowClick.bind(this));
    }

    @HostListener('click', ['$event'])
    public onClick(event: MouseEvent) {
        if (!this.isActive) {
            this.renderer.addClass(this.el.nativeElement, 'is-active');
            event.cancelBubble = true;
            this.isActive = true;
        }
    }

    public onWindowClick(event: MouseEvent) {
        if (this.isActive) {
            this.renderer.removeClass(this.el.nativeElement, 'is-active');
            this.isActive = false;
        }
    }
}