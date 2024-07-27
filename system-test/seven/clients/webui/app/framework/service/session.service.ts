import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PortraitModel } from '../model';
import { IAuthenticationResponse, IProfile } from '../../core/model';
import { Subject } from 'rxjs';
import { StoreService } from './store.service';

@Injectable()
export class SessionService {

    public SESSIONTOKEN = 'SessionToken';

    public profile?: IProfile;
    public portraitChangedEvent: Subject<PortraitModel>;
    public profileChangedEvent: Subject<boolean>;

    public constructor(
        public store: StoreService,
        public router: Router
    ) {
        this.profileChangedEvent = new Subject();
        this.portraitChangedEvent = new Subject();
    }
    
    public get isLogged(): boolean {
        return this.profile !== undefined;
    }

    public startSession(response: IAuthenticationResponse): void {
        this.store.save(this.SESSIONTOKEN, response.token);
        this.profile = response.profile;
        this.profileChangedEvent.next(true);
    }

    public endSession(): void {
        if (this.profile) {
            this.store.delete(this.SESSIONTOKEN);
            delete this.profile;
            this.profileChangedEvent.next(false);
            this.router.navigateByUrl('/');
        }
    }

}