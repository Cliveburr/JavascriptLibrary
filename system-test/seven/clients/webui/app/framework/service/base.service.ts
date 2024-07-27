import { Injectable, Injector } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { NotifyType } from "../model";
import { LoadingService } from './loading.service';
import { LocalizeService } from './localize.service';
import { NotifyService } from './notify.service';
import { SessionService } from "./session.service";
import { StoreService } from './store.service';

@Injectable()
export class BaseService {

    public constructor(
        public store: StoreService,
        public router: Router,
        public notify: NotifyService,
        public localize: LocalizeService,
        public loading: LoadingService,
        public session: SessionService,
        public injector: Injector
    ) {
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
            this.notify.addNotify(NotifyType.AlertSuccess, message, 20000);
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
                type == 'warning' ? NotifyType.AlertWarning : NotifyType.AlertInfo :
                NotifyType.AlertSuccess;
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