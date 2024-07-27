import { Component, Input } from '@angular/core';
import { ValidatorsControl } from './validators.control';

@Component({
    selector: 't-validator-msg',
    templateUrl: 'validator-msg.component.html',
    styleUrls: ['validator-msg.component.scss']
})
export class ValidatorMsgComponent {

    @Input() public validator?: ValidatorsControl;

}