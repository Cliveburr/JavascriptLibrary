import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProfileService, ProfileViewResolve } from 'src/core/service';
import { BaseService, clone, routeResolve } from 'src/framework';

@Component({
    templateUrl: './profile.component.html'
})
export class ProfileComponent {

    public model: ProfileViewResolve;

    public constructor(
        private baseService: BaseService,
        private profileService: IProfileService,
        route: ActivatedRoute
    ) {
        this.model = route.snapshot.data['resolved'].model;
    }

    public async portrait_click(): Promise<void> {
        const cloned = clone(this.model.portrait);
        const result = await this.baseService.modal.portrait('Troque sua image', cloned);
        if (result) {
            this.model.portrait = result;
            
            await this.profileService.saveProfile(this.model);

            if (this.model.isSessionProfile) {
                console.log(this.baseService.session.portraitChangedEvent)
                this.baseService.session.portraitChangedEvent.next(result);
            }
        }
    }

}

export const ProfileViewPath = routeResolve(
    ':profile/profile',
    ProfileComponent,
    IProfileService,
    'resolveProfileView'
);
