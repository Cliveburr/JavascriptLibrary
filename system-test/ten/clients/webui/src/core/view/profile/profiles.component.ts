import { Component, ViewChild } from '@angular/core';
import { IProfileService } from 'src/core';

@Component({
    templateUrl: './profiles.component.html'
})
export class ProfilesComponent {

    //@ViewChild('cards') public cards: CardCollectionComponent;

    public constructor(
        public profileService: IProfileService,
        // public relationService: RelationService
    ) {
    }

    // public async requestRelation(item: any): Promise<void> {
    //     await this.relationService.base.withLoadingNotify(
    //         this.relationService.requestRelation(item._id),
    //         'Relação solicitada!'
    //     );
    //     this.cards.refresh();
    // }

    // public profileNav(item: any): void {
    //     const url = `/${item.nickName}/profile`;
    //     this.profileService.base.router.navigateByUrl(url);
    // }
}
