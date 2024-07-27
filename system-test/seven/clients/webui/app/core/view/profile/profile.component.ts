import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProfileViewModel } from 'app/core/model';
import { ProfileService } from 'app/core/service';
import { makeProfileResolve} from 'app/framework';

@Component({
    templateUrl: './profile.component.html'
})
export class ProfileComponent {

    //@ViewChild('portraitModal') public portraitModal: PortraitModalInputComponent;
    public model: IProfileViewModel;

    public constructor(
        private profileService: ProfileService,
        route: ActivatedRoute
    ) {
        this.model = route.snapshot.data.resolved;
    }

    public async portrait_click(): Promise<void> {
        // const cloned = clone(this.model.portrait);
        // const result = await this.portraitModal.show(cloned);
        // if (result) {
        //     this.model.portrait = result;
            
        //     await this.profileService.updateProfile(this.model);

        //     if (this.nickName == this.profileService.base.session.profile!.nickName) {
        //         this.profileService.base.session.portraitChangedEvent.next(result);
        //     }
        // }
    }

}

export const ProfileViewPath = makeProfileResolve(
    ':profile/profile',
    ProfileComponent,
    ProfileService,
    'resolveProfileView'
);
