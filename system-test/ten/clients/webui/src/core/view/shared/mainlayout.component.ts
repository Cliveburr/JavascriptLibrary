import { Component } from '@angular/core';
import { LoadingService } from 'src/framework';

@Component({
    selector: 'body',
    templateUrl: 'mainlayout.component.html'
})
export class MainLayoutComponent {

    public constructor(
        public loading: LoadingService
    ) {
    }
}