import { Component, OnInit, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ISelectOption } from '../../model';
import { BaseInputComponent } from './base-input.component';

@Component({
    selector: 's-select-input',
    templateUrl: 'select-input.component.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: SelectInputComponent, multi: true }
    ]
})
export class SelectInputComponent<V> extends BaseInputComponent<V> implements OnInit {
    
    @Input() public placeholder?: string;
    @Input() public label?: string;
    @Input() public prependIcon?: string;
    @Input() public readonly?: any;
    @Input() public options: ISelectOption<V>[];
    @HostBinding('class') public hostClass: string;

    @Output() public onSelect = new EventEmitter<V>();
    
    public constructor(
    ) {
        super()
    }

    public ngOnInit(): void {
        this.prepareMeta();
        this.setDefaultOption();
        this.setControlForm();
    }

    private prepareMeta(): void {
        this.placeholder ||= '';
        this.hostClass = 'form-group ' + (this.prependIcon ? 'has-left-icon ' : '');
        this.options ||= [];
    }

    private setDefaultOption(): void {
        const deflt = this.options
            .find(o => o.default);
        if (deflt) {
            this.inValue = deflt.value!;
        }
    }

    public onValueChanged(): void {
        if (this.value === this.inValidator.formControl.value) {
            return;
        }
        this.inValidator.formControl.setValue(this.value);
    }

    public getDisplayOfValue(): string {
        const option = this.options
            .find(o => o.value === this.value);
        return option?.display || '';
    }

    public select_onChange(value: Event): void {
        const select = value.target as HTMLSelectElement;
        const index = select.selectedIndex;
        const option = this.options[index];
        if (option && typeof option.value != 'undefined') {
            this.value = option.value;
            this.onSelect.emit(this.value);
        }
    }
}