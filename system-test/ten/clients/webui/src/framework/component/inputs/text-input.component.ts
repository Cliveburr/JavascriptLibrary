import { Component, OnInit, HostBinding, Output, EventEmitter, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IValidatorsInput } from 'src/framework';
import { ValueBaseComponent } from "../value-base.component";

@Component({
    selector: 't-text-input',
    templateUrl: 'text-input.component.html',
    styleUrls: ['text-input.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: TextInputComponent, multi: true },
        { provide: ValueBaseComponent, useExisting: forwardRef(() => TextInputComponent)}
    ]
})
export class TextInputComponent extends ValueBaseComponent<string> implements OnInit {

    @Input() type?: string;
    @Input() placeholder?: string;
    @Input() label?: string;
    @Input() prependIcon?: string;
    @Input() readonly?: any;
    @Input() required?: any;
    @Input() email?: any;

    @Output() onkeydelay = new EventEmitter<string>();
    @Output() onEnter = new EventEmitter<string>();
    
    @HostBinding('class') public hostClass: string;

    public validateIcon?: string;
    public validateColor?: string;

    private timeout?: number;

    public constructor(
    ) {
        super()
        this.hostClass = '';
    }

    public ngOnInit(): void {
        this.prepareMeta();
        //this.setControlForm();
        this.control.statusChanges.subscribe(this.onStatusChange.bind(this));
        this.control.touchedChanges.subscribe(this.onStatusChange.bind(this));
    }

    private prepareMeta(): void {
        this.type ||= 'text';
        this.placeholder ||= '';
        this.readonly = this.getValueFromAnyBollean(this.readonly);
        //this.hostClass = 'form-group ' + (this.prependIcon ? 'has-left-icon ' : '');
        if (this.prependIcon) {
            if (this.prependIcon.startsWith('fab-')) {
                this.prependIcon = 'fab fa-' + this.prependIcon.substr(4);
            }
            else {
                this.prependIcon = 'fa fa-' + this.prependIcon;
            }
        }
        this.checkValidators();
    }

    private checkValidators(): void {
        const validators: IValidatorsInput = [];
        if (this.hasValueFromAny(this.required)) {
            validators.push('required');
        }
        if (this.hasValueFromAny(this.email)) {
            validators.push('email');
        }
        if (this.validators) {
            Array.isArray(this.validators) ?
                validators.push(...this.validators) :
                validators.push(this.validators);
        }
        this.initValidator(null, false, validators);
    }

    public onKeyUp(): void {
        if (this.onkeydelay) {
            clearTimeout(this.timeout);
            this.timeout = <any>setTimeout(this.fireKeyDelay.bind(this), 300);
        }
    }

    private fireKeyDelay(): void {
        this.onkeydelay.emit(this.value);
    }

    public onKeyDown(ev: KeyboardEvent): void {
        if (ev.key == 'Enter') {
            this.onEnter.emit();
        }
    }

    public onFocus(): void {
        //this.hostClass = 'active';
    }

    public onBlur(): void {
        //this.hostClass = '';
    }

    public onStatusChange(): void {
        if (this.validator.hasValidators && (this.control.touched || this.control.dirty)) {
            switch (this.control.status) {
                case 'VALID':
                    this.validateIcon = 'check';
                    this.validateColor = 'success';
                    break;
                case 'INVALID':
                    this.validateIcon = 'times';
                    this.validateColor = 'invalid';
                    break;
                default:
                    delete this.validateIcon;
            }
        }
    }
}