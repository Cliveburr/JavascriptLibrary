
export function bootstrap(cls: any): void {
    let scope = new cls();
    bindScope(document.body, scope);
}

function bindScope(el: HTMLElement, cls: any): void {
    let p = findParentScope(el.parentElement);
    cls['parent'] = p;
    el['__scope__'] = cls;
}

function findParentScope(el: HTMLElement): any {
    if (el && el['__scope__']) {
        return el['__scope__'];
    }
    else {
        if (el && el.parentElement) {
            return findParentScope(el.parentElement);
        }
        else {
            return undefined;
        }
    }
}