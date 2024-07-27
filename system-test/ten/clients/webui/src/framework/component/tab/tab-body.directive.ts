import { Directive, HostBinding, Input, OnInit } from "@angular/core";

@Directive({
    selector: 'tab, [tab]',
    exportAs: 'tab'
})
export class TabBodyDirective {

    @Input() header: string;
    @Input() enabled: boolean;
    @HostBinding('class.active') active: boolean;

    public constructor() {
        this.active = false;
        this.header = '';
        this.enabled = true;
    }
}