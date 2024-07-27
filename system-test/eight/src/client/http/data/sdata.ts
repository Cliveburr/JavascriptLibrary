
export interface IVEvent {
    func: Function;
    this: any;
    ns?: string;
}

export class SData {

    public subs: IVEvent[]

    public constructor(
        public data: any
    ) {
        this.subs = [];
    }

    public get(ns?: string): any {
        if (ns) {
            return this.data[ns];
        }
        else {
            return this.data;
        }
    }

    public set(value: any, ns?: string): void {
        if (ns) {
            this.data[ns] = value;
        }
        else {
            this.data = value;
        }
        this.trigger(ns);
    }

    private trigger(ns?: string): void {
        if (ns) {
            const forNs = this.subs
                .filter(s => s.ns == ns);
            for (const sub of forNs) {
                sub.func.call(sub.this);
            }
        }
        else {
            for (const sub of this.subs) {
                sub.func.call(sub.this);
            }
        }
    }
}