import { Injectable } from '@angular/core';
import { ModalService } from 'src/framework';
import { LoaderProfilesModel } from '..';
import { ProfileSelectApi, ProfileSelectComponent } from '../component';

@Injectable()
export class CoreModalService {


    public constructor(
        private modalService: ModalService
    ) {
    }

    public profileSelect(api: ProfileSelectApi): Promise<LoaderProfilesModel> {
        return new Promise((exec, rej) => {
            this.modalService.showModal.emit({
                content: ProfileSelectComponent,
                data: {
                    api
                },
                exec,
                rej
            })
        });
    }
}
