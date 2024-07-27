import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingService {

    public onChange = new EventEmitter<boolean>();

    private showing = false;
    private calls = 0;

    public get isShowing(): boolean {
        return this.showing;
    }

    public show() {
        this.calls++;
        if (!this.showing) {
            this.showing = true;
            this.onChange.emit(true);
        }
    }

    public hide(): void {
        this.calls--;
        if (this.showing && this.calls == 0) {
            this.showing = false;
            this.onChange.emit(false);
        }
    }

    public withPromise<T>(promise: Promise<T>): Promise<T> {
        return new Promise<T>((e, r) => {
            this.show();
            promise
                .then(data => {
                    this.hide();
                    e(data);
                })
                .catch(err => {
                    this.hide();
                    r(err);
                });
        });
    }

    public withObserver<T>(observer: Observable<T>): Observable<T> {
        this.show();
        return observer.pipe(
            finalize(() => this.hide())
        );
    }
}