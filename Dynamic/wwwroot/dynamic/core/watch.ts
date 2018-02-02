
export interface WatcherCallback<T> {
    (value?: T): void;
}

export class Watch<T> {
    private watchers: Watcher<T>[];

    public constructor(
        private invalue?: T
    ) {
        this.watchers = [];
    }

    public static create<T>(value?: T): Watch<T> {
        return new Watch(value);
    }

    public set(value?: T): void {
        this.invalue = value;
        this.raise();
    }

    public get(): T {
        return this.invalue;
    }

    public sub(callback: WatcherCallback<T>): Watcher<T> {
        let watcher = new Watcher(callback, this);
        this.watchers.push(watcher);
        return watcher;
    }

    public unsub(watcher: Watcher<T>): void {
        let find = this.watchers.indexOf(watcher);
        if (find > -1) {
            this.watchers.splice(find, 1);
        }
    }

    private raise(): void {
        for (let watcher of this.watchers) {
            if (watcher.callback) {
                watcher.callback(this.invalue);
            }
        }
    }
}

export class Watcher<T> {

    public constructor(
        public callback: WatcherCallback<T>,
        public watch: Watch<T>
    ) {
    }

    public unsub(): void {
        this.watch.unsub(this);
    }
}

interface Waiter {
    watch: Watch<any>;
    sub: Watcher<any>;
}

export class AllWatch {

    private waiters: Waiter[];
    public watchs: Watch<any>[];

    public constructor(
        ...watchs: Watch<any>[]
    ){
        this.watchs = watchs;
    }

    public on(callBack: Function): void {
        if (this.watchs.length == 0) {
            callBack();
        }

        this.waiters = [];
        this.watchs.forEach(watch => {
            var waiter: Waiter = {
                watch: watch,
                sub: null
            };
            let sub = watch.sub(() => {
                let i = this.waiters.indexOf(waiter);
                let w = this.waiters.splice(i, 1);
                w[0].watch.unsub(w[0].sub);
                if (this.waiters.length == 0) {
                    callBack();
                }
            });
            waiter.sub = sub;
            this.waiters.push(waiter)
        });
    }
}