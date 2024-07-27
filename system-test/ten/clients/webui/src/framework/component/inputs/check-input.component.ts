import { Component, Input, OnInit } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { IValidatorsInput } from "src/framework";
import { ValueBaseComponent } from "../value-base.component";

@Component({
    selector: 't-check-input',
    templateUrl: 'check-input.component.html',
    styleUrls: ['check-input.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: CheckInputComponent, multi: true }
    ]
})
export class CheckInputComponent extends ValueBaseComponent<boolean> implements OnInit {

    @Input() placeholder?: string;
    @Input() required?: any;
    
    public ngOnInit(): void {
        this.placeholder ||= '';
        this.checkValidators();
    }

    private checkValidators(): void {
        const validators: IValidatorsInput = [];
        if (this.hasValueFromAny(this.required)) {
            validators.push('required');
        }
        if (this.validators) {
            Array.isArray(this.validators) ?
                validators.push(...this.validators) :
                validators.push(this.validators);
        }
        this.initValidator(null, false, validators);
    }
}