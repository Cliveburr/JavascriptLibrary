export class HashGuard {
    constructor(lenght = 10, chars = 'ASDFGQWERTZXCVBYUIOPHJKLNMasdfgqwertzxcvbyuiophjklnm0123456789') {
        this.lenght = lenght;
        this.chars = chars;
        this.data = {};
    }
    generate() {
        var tr = '';
        do {
            tr = this.genOne();
        } while (this.data[tr]);
        return tr;
    }
    genOne() {
        var tr = '';
        for (var i = 0; i < this.lenght; i++) {
            tr += this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        return tr;
    }
    set(key, item) {
        if (this.data[key]) {
            throw 'Invalid key!';
        }
        this.data[key] = item;
    }
    aset(item) {
        let key = this.generate();
        this.set(key, item);
        return key;
    }
    get(key) {
        return this.data[key];
    }
    has(key) {
        return !!this.data[key];
    }
    delete(key) {
        let tr = this.data[key];
        delete this.data[key];
        return tr;
    }
    toList() {
        return Object
            .keys(this.data)
            .map(e => this.data[e]);
    }
}
//# sourceMappingURL=hash-guard.js.map