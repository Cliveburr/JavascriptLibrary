import { Component, Input, OnInit, HostBinding, ContentChild, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../base-component';

export type ButtonType = 'back' | 'event' | 'route' | 'permission';
export type ButtonActivate = 'normal' | 'single' | 'multi';

@Component({
    selector: 's-button',
    templateUrl: 'button.component.html'
})
export class ButtonComponent extends BaseComponent implements OnInit {

    @Input() public mrauto: any;
    @Input() public text?: string;
    @Input() public color?: string;
    @Input() public icon?: string;
    @Input() public isBack?: any;
    @Input() public isRefresh?: any;
    @Input() public router?: string;
    @Input() public permissions?: string;
    @Input() public activate?: ButtonActivate;
    @Input() public disabled?: boolean;
    @Input() public active?: boolean;
    @Input() public tooltip?: string;
    @Output() public event: EventEmitter<string>;
    @HostBinding('class') public hostClass: string;

    public type: ButtonType;

    public constructor(
        private location: Location,
        private actiavedRoute: ActivatedRoute,
        private navRouter: Router
    ) {
        super()
        this.event = new EventEmitter<string>();
    }

    public ngOnInit(): void {
        if (this.getValueFromAnyBollean(this.mrauto)) {
            this.hostClass = 'mr-auto';
        }
        if (this.getValueFromAnyBollean(this.isBack)) {
            this.type = 'back';
            this.color = 'info';
            this.icon = 'arrow-left';
            this.isBack = true;
            return;
        }
        if (this.getValueFromAnyBollean(this.isRefresh)) {
            this.type = 'event';
            this.color = 'info';
            this.icon = 'sync-alt';
            this.isRefresh = true;
            return;
        }
        if (this.event) {
            this.type = 'event';
        }
        if (this.router) {
            this.type = 'route';
        }
        if (this.permissions) {
            this.type = 'permission';
            this.icon = 'unlock-alt';
            this.color = 'secondary';
        }
        this.color ||= 'primary';
        this.activate ||= 'normal';
        this.disabled = typeof this.disabled == 'undefined' ? false: this.disabled;
        //this.tooltip ||= null;
    }

    public button_click(): void {
        switch (this.type) {
            case 'back':
                this.location.back();
                break;
            case 'event':
                this.event!.emit();
                break;
            case 'route':
                this.navigate();
                break;
        }
    }

    public navigate(): void {
        const parts = this.router!
            .split('/')
            .filter(p => p);

        const url = '/' + parts
            .map(p => {
                if (p.startsWith(':')) {
                    return this.actiavedRoute.snapshot.params[p.substr(1)];
                }
                else {
                    return p;
                }
            })
            .join('/');
        
        this.navRouter.navigateByUrl(url);
    }
}