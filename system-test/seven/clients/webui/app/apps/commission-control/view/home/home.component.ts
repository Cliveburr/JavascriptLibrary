import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './home.component.html'
})
export class HomeComponent {

    private nickName: string;

    public constructor(
        route: ActivatedRoute
    ) {
        this.nickName = route.snapshot.params['nickName'];
    }

    public buildLink(route: string): string {
        return `/${this.nickName}/commission-control/${route}`;
    }
}
