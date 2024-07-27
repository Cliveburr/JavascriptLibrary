

interface Array<T> {
    last(): T | undefined;
    remove(el: T): boolean;
    any(): boolean;
    manyRecur(func: (v: T) => T[] | null): Array<T>;
}

Array.prototype.last = function () {
    return this[this.length - 1];
};

Array.prototype.remove = function (el) {
    const index = this.indexOf(el);
    if (index > -1) {
        this.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
}

Array.prototype.any = function () {
    return this.length > 0;
}

function manyRecur<T>(result: T[], arr: T[], func: (v: T) => T[] | null): T[] {
    //const its = arr.reduce((p, c) => p.concat(c), result);
    // const its = arr.map(func);
    // result.concat(its);
    // if (its.length > 0) {

    // }
    // return result;
    for (const item of arr) {
        result.push(item);
        const childs = func(item);
        if (childs && childs.any()) {
            manyRecur(result, childs, func);
        }
    }
    return result;
}

Array.prototype.manyRecur = function (v) {
    // const result: any[] = [];


    // const otherLists = result.map(v);
    // otherLists.reduce((p, c) => p.concat(c), result);

    return manyRecur([], this, v);
}

interface Node {
    isHTMLElement(): this is HTMLElement;
}

Node.prototype.isHTMLElement = function (): boolean {
    return (!(this.nodeName == '#text' || this.nodeName == '#comment'));
}