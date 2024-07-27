import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProfileService, ProfileHomeResolve } from 'src/core/service';
import { routeResolve } from 'src/framework';

@Component({
    templateUrl: './home.component.html'
})
export class ProfileHomeComponent {

    public sessionProfileName: string;
    public model: ProfileHomeResolve;

    public constructor(
        route: ActivatedRoute,
        //private modal: ModalService
    ) {
        this.model = route.snapshot.data['resolved'].model;
        this.sessionProfileName = route.snapshot.data['resolved'].sessionProfile.name;
    }
}

export const ProfileHomePath = routeResolve(
    ':profile',
    ProfileHomeComponent,
    IProfileService,
    'resolveProfileHome'
);