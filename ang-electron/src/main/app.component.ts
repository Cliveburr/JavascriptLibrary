import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'body',
    template: '<router-outlet></router-outlet>',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public someList: string[];

    public constructor() {
        this.someList = [];
        for (let i = 0; i < 200; i++) {
            this.someList.push('testing ' + i);
        }
    }

    public ngOnInit(): void {
        //this.removeLoadingBodyClass();
    }

    private removeLoadingBodyClass(): void {
        let body = document.body;
        body.classList.remove('loading');
    }

    // public get isPublic(): boolean {
    //     return false;
    // }
}