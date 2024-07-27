import { Directive, HostBinding, Input } from "@angular/core";

@Directive({
    selector: '[collapse]'
})
export class CollapseDirective  {

    @HostBinding('class.collapsed') 
    public collapsed: boolean = false;

    @Input()
    public set collapse(value: boolean | undefined) {
        if (value) { 
            this.hide();
        }
        else { 
            this.show();
        }
    }

    public hide(): void {
        this.collapsed = true;
    }

    public show(): void  {
        this.collapsed = false;
    }

    public troggle(): void {
        this.collapsed = !this.collapsed;
    }
}