import { Component, OnInit } from '@angular/core';
import { PortraitModel, PortraitType } from '../../../framework';
import { LoginService } from '../../service';

export interface NavbarModel {
    portrait: PortraitModel;
}

@Component({
    templateUrl: 'navbar.component.html',
    selector: 'navbar'
})
export class NavbarComponent implements OnInit {
    
    public isLogged: boolean;
    public model: NavbarModel;

    public constructor(
        public loginService: LoginService
    ) {
        // this.userPhoto =  'data:image/png;base64,' + this.accountService.data.thumbnailPhoto;
        this.loginService.base.session.profileChangedEvent.subscribe(this.loginChangedEvent.bind(this));
        this.loginService.base.session.portraitChangedEvent.subscribe(this.portraitChangedEvent.bind(this));
        this.model = {
            portrait: this.getDefaultUserPortrait()
        }
    }

    public ngOnInit(): void {
        this.loginChangedEvent(this.loginService.base.session.isLogged);
    }

    private loginChangedEvent(logged: boolean): void {
        this.isLogged = logged;
        if (this.isLogged) {
            this.model.portrait = this.loginService.base.session.profile!.portrait;
        }
        else {
            this.model.portrait = this.getDefaultUserPortrait();
        }
    }

    public logoff(): void {
        this.loginService.logoff();
    }

    private getDefaultUserPortrait(): PortraitModel {
        return {
            type: PortraitType.Icon,
            icon: {
                icon: 'user',
                backColor: 'primary',
                borderColor: 'primary',
                foreColor: 'white'
            }
        }
    }

    private portraitChangedEvent(portrait: PortraitModel): void {
        this.model.portrait = portrait;
    }
}