import { Component, OnInit, HostBinding, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IColorInput } from '../../model';
import { GlobalId } from '../../helpers/global-id';
import { BaseInputComponent } from './base-input';

@Component({
    selector: 's-color-input',
    templateUrl: 'color-input.component.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: ColorInputComponent, multi: true }
    ]
})
export class ColorInputComponent extends BaseInputComponent<string, IColorInput> implements OnInit {

    @HostBinding('class') public hostClass: string;

    public colors: string[];

    public constructor(
    ) {
        super()
        this.colors = [
            'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'white'
        ]
    }

    public ngOnInit(): void {
        this.prepareMeta();
        this.setControlForm();
    }

    protected prepareMeta(): void {
        this.meta.id ||= GlobalId.generateNewId();
        this.meta.placeholder ||= '';
        this.hostClass = 'form-group ' + this.meta.class;
    }

    public option_click(color: string): void {
        if (this.value === color) {
            return;
        }
        this.value = color;
        this.inValidator.formControl.setValue(this.value);
    }
}