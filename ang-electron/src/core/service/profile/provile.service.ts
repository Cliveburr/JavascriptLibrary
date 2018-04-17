import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProfileService {

    private _isLogged: boolean;

    public get isLogged(): Observable<boolean> {
        return Observable.of(this._isLogged);
    }

    public setLogged(value: boolean): void {
        this._isLogged = value;
    }
}