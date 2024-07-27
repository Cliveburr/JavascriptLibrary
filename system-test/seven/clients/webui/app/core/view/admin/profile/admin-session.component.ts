import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITableData, SessionType, ValueFormatedType } from '@seven/webshared';
import { ProfileService } from 'app/core/service';

@Component({
    templateUrl: './admin-session.component.html'
})
export class AdminSessionComponent implements OnInit {

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
                { header: 'Type', property: 'type', type: ValueFormatedType.enum, enumType: SessionType },
                { header: 'Token', property: 'token', canOrder: false },
                { header: 'Active', property: 'isActive' },
                { header: 'IP', property: 'ip6' },
                { header: 'Created', property: 'createDateTime', type: ValueFormatedType.date },
                { header: 'Ended', property: 'endDateTime', type: ValueFormatedType.date }
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
            apiItems: this.profileService.call.adminSessionTable
        }
    }

    // public profileLogins(): void {
    // }

    // public profileSessions(items: any[]): void {
    // }
}
