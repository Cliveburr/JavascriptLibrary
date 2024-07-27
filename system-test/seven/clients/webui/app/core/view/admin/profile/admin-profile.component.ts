import { Component } from '@angular/core';
import { ITableData, ActiveButtonType, NotifyType } from '@seven/webshared';
import { ProfileService } from 'app/core/service';

@Component({
    templateUrl: './admin-profile.component.html'
})
export class AdminProfileComponent {

    public data: ITableData;

    public constructor(
        private profileService: ProfileService
    ) {
        this.data = {
            host: this,
            cols: [
                { header: 'Name', property: 'name' },
                { header: 'Email', property: 'email' }
            ],
            filters: [
                { type: 1, alias: 'Name', size: 6, loader: {
                    type: 1, property: 'name', regexPattern: '{{value}}', regexFlags: 'i'
                } }
            ],
            buttons: [
                { name: 'Logins', event: 'profileLogins', active: ActiveButtonType.single, style: 'btn-primary' },
                { name: 'Sessions', event: 'profileSessions', active: ActiveButtonType.single, style: 'btn-primary' }
            ],
            apiItems: profileService.call.adminProfileTable
        }
    }

    public profileLogins(items: any[]): void {
        const id = items[0]._id;
        this.profileService.base.router.navigateByUrl(`/admin/profile/${id}/login`);
    }

    public profileSessions(items: any[]): void {
        const id = items[0]._id;
        this.profileService.base.router.navigateByUrl(`/admin/profile/${id}/session`);
    }
}
