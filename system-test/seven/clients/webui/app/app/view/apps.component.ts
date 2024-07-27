import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICardCollection, CardCollectionComponent } from '../../framework';
import { AppsService } from '../service';
import { AppPrototypeModel } from '../model';

@Component({
    templateUrl: './apps.component.html'
})
export class AppsComponent implements OnInit {

    public meta: ICardCollection<AppPrototypeModel>;
    @ViewChild('cards') cards: CardCollectionComponent<AppPrototypeModel>;

    public constructor(
        private appsService: AppsService,
        public route: ActivatedRoute
    ) {
    }

    public ngOnInit(): void {
        this.meta = {
            apiItems: this.appsService.call.getApps
        }
    }

    public async install(item: AppPrototypeModel): Promise<void> {
        await this.appsService.base.loading.withPromise(
            this.appsService.call.install(item._id)
        );

        this.cards.refresh!();
    }

    public appLink(item: AppPrototypeModel): string {
        return `/${this.appsService.base.session.profile!.nickName}/${item.shortName}`;
    }
}