import { Component } from '@angular/core';
import { IProfileService } from 'src/core';
import { BaseService, ModalBase, ModalData } from 'src/framework';

export enum ProfileSelectApi {
    loaderProfiles = 0,
    loaderProfilesForRelations = 1
}

export interface ProfileSelectData {
    api: ProfileSelectApi;
}

@Component({
    templateUrl: 'profile-select.component.html'
})
export class ProfileSelectComponent implements ModalBase {

    public modalData!: ModalData;
    public api: any;

    public constructor(
        public profileService: IProfileService,
        public base: BaseService
    ) {
    }
    
    public initialize(modalData: ModalData): void {
        this.modalData = modalData;

        const data = this.modalData.data as ProfileSelectData;
        switch (data.api) {
            case ProfileSelectApi.loaderProfilesForRelations:
                this.api = this.profileService.loaderProfilesForRelations;
                break;
            case ProfileSelectApi.loaderProfiles:
            default:
                this.api = this.profileService.loaderProfiles;
                break;
        }
    }

    public cancel(): void {
        this.modalData.hide!();
        if (this.modalData.exec) {
            this.modalData.exec();
        }
    }

    public confirm(): void {
    }

    public select(item: any): void {
        this.modalData.hide!();
        if (this.modalData.exec) {
            this.modalData.exec(item);
        }
    }
}