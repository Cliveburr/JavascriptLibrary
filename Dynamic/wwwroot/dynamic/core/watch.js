export class Watch {
    constructor(invalue) {
        this.invalue = invalue;
        this.watchers = [];
    }
    static create(value) {
        return new Watch(value);
    }
    set(value) {
        this.invalue = value;
        this.raise();
    }
    get() {
        return this.invalue;
    }
    sub(callback) {
        let watcher = new Watcher(callback, this);
        this.watchers.push(watcher);
        return watcher;
    }
    unsub(watcher) {
        let find = this.watchers.indexOf(watcher);
        if (find > -1) {
            this.watchers.splice(find, 1);
        }
    }
    raise() {
        for (let watcher of this.watchers) {
            if (watcher.callback) {
                watcher.callback(this.invalue);
            }
        }
    }
}
export class Watcher {
    constructor(callback, watch) {
        this.callback = callback;
        this.watch = watch;
    }
    unsub() {
        this.watch.unsub(this);
    }
}
export class AllWatch {
    constructor(...watchs) {
        this.watchs = watchs;
    }
    on(callBack) {
        if (this.watchs.length == 0) {
            callBack();
        }
        this.waiters = [];
        this.watchs.forEach(watch => {
            var waiter = {
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
            this.waiters.push(waiter);
        });
    }
}
//# sourceMappingURL=watch.js.map