import { Inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { NotifyService } from "./notify.service";
import { LoadingService } from "./loading.service";
import { StoreService } from "./store.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SessionService } from "./session.service";
import { ModalService } from ".";

@Injectable()
export class BaseService {

    private style?: HTMLLinkElement;

    public constructor(
        @Inject(DOCUMENT) private document: Document,
        public store: StoreService,
        public notify: NotifyService,
        public router: Router,
        public loading: LoadingService,
        public session: SessionService,
        public modal: ModalService
    ) {
    }

    public changeStyle(color: 'blue' | 'dark') {
        return this.withLoading(
            new Promise<void>((res, rej) => {
                const head = this.document.getElementsByTagName('head')[0]
                
                if (this.style) {
                    head.removeChild(this.style);
                }

                this.style = this.document.createElement('link');
                this.style.rel = 'stylesheet';
                this.style.href = `${color}-colors.css`;
                this.style.onload = <any>res;
                this.style.onerror = <any>rej;
        
                head.appendChild(this.style);
            })
        );
    }

    public withLoading<T>(promise: Promise<T>): Promise<T> {
        return new Promise<T>((e, r) => {
            this.loading.show();
            promise
                .then(data => {
                    this.loading.hide();
                    e(data);
                })
                .catch(err => {
                    this.loading.hide();
                    r(err);
                });
        });
    }

    public async withLoadingNav(promise: Promise<void>, url: string): Promise<void> {
        this.loading.show();
        try {
            await promise;
            await this.router.navigateByUrl(url);
        }
        catch (err) {
            this.loading.hide();
            throw err;
        }
        this.loading.hide();
    }

    public async withLoadingNavNotify(promise: Promise<void>, message: string, url: string | [ActivatedRoute, string]): Promise<void> {
        this.loading.show();
        try {
            await promise;
            this.notify.addNotify('success', message, 20000);
            await this.navigate(url);
        }
        catch (err) {
            this.loading.hide();
            throw err;
        }
        this.loading.hide();
    }

    public navigate(url: string | [ActivatedRoute, string]): Promise<boolean> {
        const preparedUrl = Array.isArray(url) ?
            this.prepareUrl(url[0], url[1]) : 
            url;
        return this.router.navigateByUrl(preparedUrl);
    }

    private prepareUrl(route: ActivatedRoute, url: string): string {
        const parts = url
            .split('/')
            .filter(p => p);

        return '/' + parts
            .map(p => {
                if (p.startsWith(':')) {
                    return route.snapshot.params[p.substr(1)];
                }
                else {
                    return p;
                }
            })
            .join('/');
    }

    public async withLoadingNotify(promise: Promise<void>, message: string, type?: 'warning' | 'info'): Promise<void> {
        this.loading.show();
        try {
            await promise;
            const notifyType = type ?
                type == 'warning' ? 'warning' : 'info' :
                'success';
            this.notify.addNotify(notifyType, message, 60000);
        }
        catch (err) {
            this.loading.hide();
            console.error(err);
            throw err;
        }
        this.loading.hide();
    }
}