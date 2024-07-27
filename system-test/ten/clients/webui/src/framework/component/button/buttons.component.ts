import { Component, ContentChildren, QueryList } from '@angular/core';
import { ButtonComponent } from './button.component';

@Component({
    selector: 't-buttons',
    templateUrl: 'buttons.component.html'
})
export class ButtonsComponent {

    @ContentChildren(ButtonComponent) buttons?: QueryList<ButtonComponent>;

    public constructor() {

    }

    public ngAfterContentInit(): void {
    }
}