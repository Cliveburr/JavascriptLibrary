
export class HashGuard<T> {
    private data: { [key: string]: T };

    public constructor(
        public lenght: number = 10,
        public chars: string = 'ASDFGQWERTZXCVBYUIOPHJKLNMasdfgqwertzxcvbyuiophjklnm0123456789'
    ) {
        this.data = {};
    }

    public generate(): string {
        var tr = '';
        do {
            tr = this.genOne();
        } while (this.data[tr]);
        return tr;
    }

    private genOne(): string {
        var tr = '';
        for (var i = 0; i < this.lenght; i++) {
            tr += this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        return tr;
    }

    public set(key: string, item: T): void {
        if (this.data[key]) {
            throw 'Invalid key!';
        }
        this.data[key] = item;
    }

    public aset(item: T): string {
        let key = this.generate();
        this.set(key, item);
        return key;
    }

    public get(key: string): T {
        return this.data[key];
    }

    public has(key: string): boolean {
        return !!this.data[key];
    }

    public delete(key: string): T {
        let tr = this.data[key];
        delete this.data[key];
        return tr;
    }

    public toList(): Array<T> {
        return Object
            .keys(this.data)
            .map(e => this.data[e]);
    }
}