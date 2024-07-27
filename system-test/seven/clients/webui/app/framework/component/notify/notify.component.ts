import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifyService } from '../../service';
import { NotifyMessage, NotifyType } from '../../model';

@Component({
    selector: 'notify',
    templateUrl: 'notify.component.html',
    styleUrls: ['notify.component.scss']
})
export class NotifyComponent implements OnInit {

    public messages: Array<NotifyMessage> = [];

    public constructor(
        private sanitizer: DomSanitizer,
        private service: NotifyService
    ) {
    }

    public ngOnInit(): void {
        this.service.setComponent(this);
    }

    public addNotify(msg: NotifyMessage): void {
        msg.htmlText = this.sanitizer.sanitize(SecurityContext.HTML, msg.htmlText);
        
        if (!msg.timeout && msg.type != NotifyType.AlertDanger) {
            msg.timeout = 15000;
        }

        this.messages.push(msg);
    }

    public alert_onClosed(msg: NotifyMessage): void {
        let i = this.messages.indexOf(msg);
        if (i > -1) {
            this.messages.splice(i, 1);
        }
    }
}