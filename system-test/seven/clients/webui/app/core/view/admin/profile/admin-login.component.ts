import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITableData, ActiveButtonType, NotifyType } from '@seven/webshared';
import { ProfileService } from 'app/core/service';

@Component({
    templateUrl: './admin-login.component.html'
})
export class AdminLoginComponent implements OnInit {

    public data: ITableData;

    public constructor(
        private profileService: ProfileService,
        public route: ActivatedRoute
    ) {
    }

    public ngOnInit(): void {
        const id = this.route.snapshot.params['id'];

        this.data = {
            host: this,
            cols: [
                { header: 'Type', property: 'type' }
            ],
            filters: [
                { type: 0, loader: { type: 2, property: 'profilePrivateId', value: id } }
                // { type: 0, alias: 'Name', size: 6, loader: {
                //     type: 1, property: 'name', regexPattern: '{{value}}', regexFlags: 'i'
                // } }
            ],
            // buttons: [
            //     { name: 'Logins', event: 'profileLogins', active: ActiveButtonType.single, style: 'btn-primary' },
            //     { name: 'Sessions', event: 'profileSessions', active: ActiveButtonType.single, style: 'btn-primary' }
            // ],
            apiItems: this.profileService.call.adminLoginTable
        }
    }

    // public profileLogins(): void {
    // }

    // public profileSessions(items: any[]): void {
    // }
}
