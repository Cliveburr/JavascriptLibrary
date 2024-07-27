import { Directive, Input, HostBinding, ElementRef, Renderer2, AfterContentInit } from '@angular/core';

@Directive({
    selector: '[collapse_old]'
})
export class CollapseDirective implements AfterContentInit { 

    @HostBinding('class.collapsed') 
    public collapsed: boolean = false;

    @HostBinding('style.maxHeight') 
    public maxHeight: string;
    
    private el: HTMLElement;

    @Input()
    public set collapse(value: boolean | undefined) {
        if (value) { 
            this.hide();
        }
        else { 
            this.show();
        }
    }

    public constructor(
        elementRef: ElementRef,
        private renderer: Renderer2
    ) {
        this.el = elementRef.nativeElement;
        //this.renderer.setElementClass(this.el, 'collapsable', true);
    }

    public ngAfterContentInit(): void {
        setTimeout(this.setMaxHeight.bind(this), 1); 
    }

    private setMaxHeight(): void {
        this.maxHeight = this.el.clientHeight.toString() + 'px';
    }

    private hide(): void {
        if (this.collapsed)
            return;

        this.setMaxHeight(); 
        this.collapsed = true;
    }

    private show(): void  {
        if (!this.collapsed)
            return;

        this.collapsed = false;
    }  
}