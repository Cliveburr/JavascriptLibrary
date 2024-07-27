import { Component, Input } from '@angular/core';
import { ValidatorsControl } from './validators.control';

@Component({
    selector: 's-validators',
    templateUrl: 'validators.component.html'
})
export class ValidatorsComponent {

    @Input() public control: ValidatorsControl;

}