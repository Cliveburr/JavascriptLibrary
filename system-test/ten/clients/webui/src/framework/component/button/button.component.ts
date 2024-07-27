import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef, HostBinding } from "@angular/core";
import { Location } from '@angular/common';
import { BaseService, NotifyService } from "src/framework";
import { BaseComponent } from "../base.component";
import { FormValidatorComponent } from "../inputs/validators/form-validator.component";
import { ActivatedRoute, Router } from "@angular/router";

export type ButtonType = 'back' | 'event' | 'route' | 'security';

@Component({
    selector: 't-button',
    templateUrl: 'button.component.html',
    styleUrls: ['button.component.scss']
})
export class ButtonComponent extends BaseComponent implements OnInit {
    
    @Input() mrauto?: string;
    @Input() text?: string;
    @Input() color?: string;
    @Input() clickInvalidMsg?: string;
    @Input() leftIcon?: string;
    @Input() rightIcon?: string;
    @Input() dropIcon?: string;
    @Input() isBack?: any;
    @Input() isRefresh?: any;
    @Input() router?: string;
    @Input() security?: string;
    @HostBinding('class') public hostClass?: string;
    @Output() event = new EventEmitter<undefined>();
    @Output() clickValid = new EventEmitter<undefined>();

    public validator?: FormValidatorComponent;
    public type: ButtonType;

    public constructor(
        private base: BaseService,
        private location: Location,
        private navRouter: Router,
        private actiavedRoute: ActivatedRoute,
        public changes: ChangeDetectorRef
    ) {
        super()
        this.type = 'event';
    }

    public ngOnInit(): void {
        if (this.getValueFromAnyBollean(this.mrauto)) {
            this.hostClass = 'mr-auto';
        }
        if (this.getValueFromAnyBollean(this.isBack)) {
            this.type = 'back';
            this.color = 'info';
            this.rightIcon = 'arrow-left';
            this.isBack = true;
            return;
        }
        if (this.getValueFromAnyBollean(this.isRefresh)) {
            this.type = 'event';
            this.color = 'info';
            this.rightIcon = 'sync-alt';
            this.isRefresh = true;
            return;
        }
        if (this.router) {
            this.type = 'route';
        }
        if (this.security) {
            this.type = 'security';
            this.rightIcon = 'unlock-alt';
            this.color = 'secondary';
        }
        this.color ||= 'normal';
    }

    public doclick(): void {
        switch (this.type) {
            case 'back':
                this.location.back();
                break;
            case 'event':
                {
                    if (this.validator) {
                        this.validator.group.markAllAsTouched();

                        if (this.validator.group.valid) {
                            if (this.clickValid) {
                                this.clickValid.emit();
                            }
                            else {
                                this.event.emit();
                            }
                        }
                        else {
                            if (this.clickInvalidMsg) {
                                this.base.notify.addNotify('danger', this.clickInvalidMsg);
                            }
                        }
                    }
                    else {
                        this.event.emit();
                    }
                    break;
                }
            case 'route':
                this.navigate();
                break;
            case 'security':
                this.base.modal.security(this.security);
                break;
        }
    }

    public setValidator(validator: FormValidatorComponent): void {
        if (this.clickValid || this.clickInvalidMsg) {
            this.validator = validator;
        }
    }

    private navigate(): void {
        const parts = this.router!
            .split('/')
            .filter(p => p);

        const url = '/' + parts
            .map(p => {
                if (p.startsWith(':')) {
                    switch (p.substr(1)) {
                        case 'session':
                            return this.base.session.profile?.nickName;
                        case 'profile':
                        case 'app':
                            return this.actiavedRoute.snapshot.params[p.substr(1)];
                    }
                }
                else {
                    return p;
                }
            })
            .join('/');
        
        this.navRouter.navigateByUrl(url);
    }
}