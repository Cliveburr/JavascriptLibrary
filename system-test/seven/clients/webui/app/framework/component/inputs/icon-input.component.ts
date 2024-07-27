import { Component, HostBinding, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IIconInput } from '../../model';
import { fontAwesomeIcons, GlobalId } from '../../helpers';
import { BaseInputComponent } from './base-input';

@Component({
    selector: 's-icon-input',
    templateUrl: 'icon-input.component.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: IconInputComponent, multi: true }
    ]
})
export class IconInputComponent extends BaseInputComponent<string, IIconInput> implements OnInit {
    
    @HostBinding('class') public hostClass: string;

    public icons: string[];

    public constructor(
    ) {
        super()
        // this.icons = [
        //     'user', 'users', 'user-friends', 'users-cog', 'address-book', 'address-card', 'adjust', 'adn', 'adversal', 'air-freshener',
        //     'daairbnb', 'anchor',
        //     'android', 'angry', 'apple-alt', 'bell', 'bicycle', 'blind', 'book-medical', 'bowling-ball', 'btc',
        //     'car', 'cat', 'chess', 'child', 'city', 'coffee', 'crow', 'dove', 'dna',
        // ]
        this.icons = fontAwesomeIcons;
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