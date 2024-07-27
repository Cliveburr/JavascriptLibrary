import { Component, Input } from '@angular/core';

@Component({
    selector: 's-container',
    templateUrl: 'container.component.html'
})
export class ContainerComponent {

    @Input() public title?: string;

}