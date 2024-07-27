import { Component, OnInit, HostBinding, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { INumberInput } from '../../model';
import { CurrencyMaskConfig } from 'ngx-currency';
import { GlobalId } from '../../helpers/global-id';
import { BaseInputComponent } from './base-input';

@Component({
    selector: 's-number-input',
    templateUrl: 'number-input.component.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: NumberInputComponent, multi: true }
    ]
})
export class NumberInputComponent extends BaseInputComponent<number, INumberInput> implements OnInit {
    
    @Output() public onkeydelay = new EventEmitter<number>();
    @HostBinding('class') public hostClass: string;
    
    public maskOptions: CurrencyMaskConfig;
    private timeout?: number;

    public constructor(
    ) {
        super()
    }

    public ngOnInit(): void {
        this.prepareMeta();
        this.setMaskOptions();
        this.setControlForm();
    }

    protected prepareMeta(): void {
        this.inMeta.id ||= GlobalId.generateNewId();
        this.inMeta.type ||= 'text';
        this.inMeta.placeholder ||= '';
        this.hostClass = 'form-group ' + this.inMeta.class;
    }

    private setMaskOptions(): void {
        this.maskOptions = {
            align: 'left',
            allowNegative: true,
            decimal: ',',
            precision: this.inMeta.money ? 2 : this.inMeta.precision || 2,
            prefix: this.inMeta.money ? 'R$ ' : '',
            suffix: '',
            thousands: '.',
            min: this.inMeta.min,
            max: this.inMeta.max,
            nullable: true,
            inputMode: this.inMeta.money ? 0: 1,
            allowZero: false
        };
    }

    public onKeyUp(): void {
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
        if (this.inValidator) {
            this.inValidator.formControl.setValue(this.value);
        }
    }
}
