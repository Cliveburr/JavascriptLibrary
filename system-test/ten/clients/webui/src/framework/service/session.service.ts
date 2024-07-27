import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PortraitModel } from '../interface.index';
import { StoreService } from './store.service';

interface IProfile {
    name: string;
    nickName: string;
    portrait: PortraitModel;
}

@Injectable()
export class SessionService {

    public profile?: IProfile;
    public portraitChangedEvent: Subject<PortraitModel>;
    public profileChangedEvent: Subject<boolean>;

    private SESSIONTOKEN = 'SessionToken';

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

    public readSessionToken(): string | undefined {
        return this.store.read(this.SESSIONTOKEN);
    }

    public startSession(token: string, profile: IProfile): void {
        this.store.save(this.SESSIONTOKEN, token);
        this.profile = profile;
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