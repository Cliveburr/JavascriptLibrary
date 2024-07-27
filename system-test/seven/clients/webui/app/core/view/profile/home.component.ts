import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProfileHomeModel } from 'app/core/model';
import { ProfileService } from 'app/core/service';
import { makeProfileResolve, ModalService } from 'app/framework';

@Component({
    templateUrl: './home.component.html'
})
export class ProfileHomeComponent {

    public model: IProfileHomeModel;

    public constructor(
        route: ActivatedRoute,
        private modal: ModalService
    ) {
        this.model = route.snapshot.data.resolved;
    }

    public test(): void {
        this.modal.show();
    }
}

export const ProfileHomePath = makeProfileResolve(
    ':profile',
    ProfileHomeComponent,
    ProfileService,
    'resolveProfileHome'
);
