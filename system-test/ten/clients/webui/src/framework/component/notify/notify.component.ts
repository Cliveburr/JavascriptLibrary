import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifyService } from '../../service';
import { NotifyMessage, NotifyType } from './notify.model';

@Component({
    selector: 't-notify',
    templateUrl: 'notify.component.html',
    styleUrls: ['notify.component.scss']
})
export class NotifyComponent implements OnInit {

    public messages: Array<NotifyMessage>;

    public constructor(
        private sanitizer: DomSanitizer,
        private service: NotifyService
    ) {
        this.messages = [];
    }

    public ngOnInit(): void {
        this.service.setComponent(this);
    }

    public addNotify(msg: NotifyMessage): void {

        const content = this.sanitizer.sanitize(SecurityContext.HTML, msg.content);
        if (content == null) {
            console.error('Invalid notify msg', msg);
            return;
        }
        msg.content = content;
        if (!msg.timeout && msg.timeout !== null) {
            msg.timeout = 15000;
        }
        if (msg.timeout) {
            msg.timeoutsub = <any>setTimeout(this.closedMsg.bind(this, msg), msg.timeout);
        }
        this.messages.push(msg);
    }

    public closedMsg(msg: NotifyMessage): void {
        if (msg.timeoutsub) {
            clearTimeout(msg.timeoutsub);
            delete msg.timeoutsub;
        }
        let i = this.messages.indexOf(msg);
        if (i > -1) {
            this.messages.splice(i, 1);
        }
    }
}