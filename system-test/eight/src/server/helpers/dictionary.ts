
export class Dictionary<T> {

    private data: { [key: string]: any };
    private _count: number;

    public constructor(
    ) {
        this.data = {};
        this._count = 0;
    }

    public get count(): number {
        return this._count;
    }

    public set(key: string, item: T): void {
        this.data[key] = item;
        if (!(key in this.data)) {
            this._count++;
        }
    }

    public get(key: string): T | undefined {
        return this.data[key];
    }

    public has(key: string): boolean {
        return key in this.data;
    }

    public remove(key: string): boolean {
        if (key in this.data) {
            delete this.data[key];
            this._count--;
            return true;
        }
        else {
            return false;
        }
    }

    public toList(): Array<T> {
        return Object.keys(this.data)
            .map(e => this.data[e]);
    }

    public clone(): Dictionary<T> {
        let clone = new Dictionary<T>();
        let clonedData = <any>{};
        for (let key of Object.keys(this.data)) {
            clonedData[key] = this.data[key];
        }
        clone.data = clonedData;
        clone._count = this._count;
        return clone;
    }
}