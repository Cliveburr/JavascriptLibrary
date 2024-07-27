import { Component, Input, OnInit } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { ValueBaseComponent } from "../value-base.component";

@Component({
    selector: 't-color-input',
    templateUrl: 'color-input.component.html',
    styleUrls: ['color-input.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: ColorInputComponent, multi: true }
    ]
})
export class ColorInputComponent extends ValueBaseComponent<string> implements OnInit {
    
    @Input() label?: string;
    @Input() prependIcon?: string;

    public colors: string[];
    public validateColor?: string;

    public constructor(
    ) {
        super()
        this.colors = [
            'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'white'
        ]
    }

    public ngOnInit(): void {
        this.initValidator(null, false, []);
    }
}