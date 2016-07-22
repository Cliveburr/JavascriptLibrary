
export class Event<T extends Function> {
    private _events: Array<T>;
    public raise: T;

    constructor() {
        this._events = [];
        this.raise = <any>this._raise;
    }

    private _raise(...args: any[]): void {
        this._events.forEach((e: T) => {
            e.apply(e, args);
        });
    }

    public add(fun: T): void {
        this._events.push(fun);
    }

    public remove(fun: T): boolean {
        let i = this._events.indexOf(fun);
        if (i == -1) {
            return false;
        }
        else {
            this._events.splice(i, 1);
            return true;
        }
    }
}