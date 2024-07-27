import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { fontAwesomeIcons } from '../../helpers';
import { ValueBaseComponent } from '../value-base.component';

@Component({
    selector: 't-icon-input',
    templateUrl: 'icon-input.component.html',
    styleUrls: ['icon-input.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: IconInputComponent, multi: true }
    ]
})
export class IconInputComponent extends ValueBaseComponent<string> implements OnInit {
    
    @Input() label?: string;
    @Input() prependIcon?: string;

    public icons: string[];
    public validateColor?: string;

    public constructor(
    ) {
        super()
        this.icons = fontAwesomeIcons;
    }

    public ngOnInit(): void {
        this.initValidator(null, false, []);
    }
}