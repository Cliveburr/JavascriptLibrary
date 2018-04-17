import { Component } from '@angular/core';

@Component({
    selector: 'publicLayout',
    templateUrl: 'public-layout.component.html',
})
export class PublicLayoutComponent {

    public constructor() {
        console.log('hit here');
    }
}