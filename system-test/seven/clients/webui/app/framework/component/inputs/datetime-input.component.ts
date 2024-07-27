import { Component, OnInit, HostBinding, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IDatetimeInput } from '../../model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GlobalId } from '../../helpers/global-id';
import { BaseInputComponent } from './base-input';

@Component({
    selector: 's-datetime-input',
    templateUrl: 'datetime-input.component.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: DatetimeInputComponent, multi: true }
    ]
})
export class DatetimeInputComponent extends BaseInputComponent<Date | undefined, IDatetimeInput> implements OnInit {
    
    @Output() public onkeydelay = new EventEmitter<Date>();
    @HostBinding('class') public hostClass: string;
    
    public bsConfig: BsDatepickerConfig;
    private timeout?: number;

    public constructor(
    ) {
        super();
    }

    public ngOnInit(): void {
        this.prepareMeta();
        this.setBsConfig();
        this.setControlForm();
    }

    protected prepareMeta(): void {
        this.inMeta.id ||= GlobalId.generateNewId();
        this.inMeta.placeholder ||= '';
        this.hostClass = 'form-group ' + this.inMeta.class;
    }

    private setBsConfig(): void {
        this.bsConfig = <any>{
            containerClass: 'theme-blue',
            dateInputFormat: 'DD/MM/YYYY',
            adaptivePosition: true
        };
        if (this.inMeta.todayButton) {
            this.bsConfig.showTodayButton = true;
            this.bsConfig.todayPosition = 'center';
        }
    }

    public bsValueChange(): void {
        let formValue = this.inValidator.formControl.value;
        if (typeof formValue === 'string') {
            formValue = new Date(formValue);
        }
        if (formValue === null || this.value === formValue) {
            return;
        }
        this.value = formValue;
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
            if (this.value === this.inValidator.formControl.value) {
                return;
            }
            this.inValidator.formControl.setValue(this.value);
        }
    }
}
