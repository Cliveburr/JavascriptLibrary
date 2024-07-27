import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[icon]' 
}) 
export class IconDirective {

    private inIcon?: string;
    private faCls?: string;
    private cls?: string;

    public constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) {
    }

    @Input('icon')
    public set icon(value: string | undefined) {
        if (value) {
            if (value.startsWith('b-')) {
                this.faCls = 'fab';
                this.cls = 'fa-' + value.substr(2);
            }
            else if (value.startsWith('s-')) {
                this.faCls = 'fas';
                this.cls = 'fa-' + value.substr(2);
            }
            else if (value.startsWith('r-')) {
                this.faCls = 'far';
                this.cls = 'fa-' + value.substr(2);
            }
            else {
                this.faCls = 'fa';
                this.cls = 'fa-' + value;
            }
            this.renderer.addClass(this.el.nativeElement, this.faCls);
            this.renderer.addClass(this.el.nativeElement, this.cls);
            this.inIcon = value;
        }
        else {
            if (this.cls) {
                this.renderer.removeClass(this.el.nativeElement, this.faCls!);
                this.renderer.removeClass(this.el.nativeElement, this.cls);
                this.faCls = this.cls = this.inIcon = value;
            }
        }
    }

    public get icon(): string | undefined {
        return this.inIcon;
    }
}
