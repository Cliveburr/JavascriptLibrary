import { Component, OnInit, HostBinding, Output, EventEmitter, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputComponent } from './base-input.component';

@Component({
    selector: 's-text-input',
    templateUrl: 'text-input.component.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: TextInputComponent, multi: true }
    ]
})
export class TextInputComponent extends BaseInputComponent<string> implements OnInit {
    
    @Input() type?: string;
    @Input() placeholder?: string;
    @Input() label?: string;
    @Input() prependIcon?: string;
    @Input() readonly?: any;

    @Output() public onkeydelay = new EventEmitter<string>();
    @Output() public onEnter = new EventEmitter<string>();
    @HostBinding('class') public hostClass: string;
    
    private timeout?: number;

    public constructor(
    ) {
        super()
    }

    public ngOnInit(): void {
        this.prepareMeta();
        this.setControlForm();
    }

    protected prepareMeta(): void {
        this.type ||= 'text';
        this.placeholder ||= '';
        this.readonly = this.getValueFromAnyBollean(this.readonly);
        this.hostClass = 'form-group ' + (this.prependIcon ? 'has-left-icon ' : '');
    }

    public onKeyUp(): void {
        //console.log('onKeyUp', this.value, this.inValidator.formControl.value)
        if (this.value === this.inValidator.formControl.value) {
            return;
        }
        this.value = this.inValidator.formControl.value;
        if (this.onkeydelay) {
            clearTimeout(this.timeout);
            this.timeout = <any>setTimeout(this.fireKeyDelay.bind(this), 300);
        }
    }

    private fireKeyDelay(): void {
        this.onkeydelay.emit(this.value);
    }

    public onValueChanged(): void {
        //console.log('onValueChanged', this.value, this.inValidator.formControl.value)
        if (this.inValidator) {
            if (this.value === this.inValidator.formControl.value) {
                return;
            }
            this.inValidator.formControl.setValue(this.value);
        }
    }

    public onKeyDown(ev: KeyboardEvent): void {
        if (ev.key == 'Enter') {
            this.onEnter.emit();
        }
    }
}
