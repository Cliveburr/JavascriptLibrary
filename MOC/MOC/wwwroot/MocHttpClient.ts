
module moc {
    export interface IObject {
        _n?: string;
        _d?: string[];
        _v?: any;
        _c?: IObject[];
    }

    export interface IObjectDef {
        getObject(model: any): HTMLElement;
        preRender?(el: HTMLElement): void;
        processChilds?(el: HTMLElement, chidls: IObject[]): void;
    }

    export function getScript(name: string, callBack: (err: string) => void): void {
        var script, head = document.head;

        script = document.createElement("script");
        script.async = true;
        script.src = name;

        script.onload = script.onreadystatechange = function (_, isAbort) {
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = script.onreadystatechange = null;

                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }

                script = null;

                if (isAbort)
                    callBack('Error loading script: ' + name);
                else {
                    callBack(null);
                }
            }
        };

        script.onerror = () => {
            callBack('Error loading script: ' + name);
        };

        head.insertBefore(script, head.firstChild);
    }

    export function post(url: string, data: string, callBack: (err: string, data: string) => void): void {
        var client = new XMLHttpRequest();

        var statechange = (ev): void => {
            if (client.readyState === client.DONE) {
                if (client.status === 200) {
                    callBack(null, client.responseText);
                } else {
                    callBack(client.statusText, null);
                }
            }
        };

        var onerror = (): void => {
            callBack(client.statusText, null);
        }

        client.onreadystatechange = statechange;
        client.onerror = onerror;
        client.open("POST", url, true);
        client.setRequestHeader("Content-type", "text/plain");
        client.send(data);
    }

    export interface IAjaxRequestHeader {
        header: string;
        value: string;
    }

    export function ajax(url: string, data: any, method: string, headers: IAjaxRequestHeader[], callBack: (err: string, data: string) => void): void {
        var client = new XMLHttpRequest();

        var statechange = (ev): void => {
            if (client.readyState === client.DONE) {
                if (client.status === 200) {
                    callBack(null, client.responseText);
                } else {
                    callBack(client.statusText, null);
                }
            }
        };

        var onerror = (): void => {
            callBack(client.statusText, null);
        }

        client.onreadystatechange = statechange;
        client.onerror = onerror;
        client.open(method, url, true);

        if (headers) {
            headers.forEach((head) => {
                client.setRequestHeader(head.header, head.value);
            });
        }

        client.send(data);
    }

    export class Namespace {
        public next: Namespace = null;

        constructor(
            public name: string,
            public value: any,
            public parent: Namespace) {
        }

        public static parse(base: Object, namespace: string): Namespace[];
        public static parse(namespace: string): Namespace[];
        public static parse(ag1?: any, ag2?: any): Namespace[] {
            var tr: Array<Namespace> = [], last: Object = null, parent: Namespace = null, namespace = null;

            if (ag2 !== undefined) {
                last = ag1;
                namespace = ag2;
            }
            else {
                last = window;
                namespace = ag1;
            }

            parent = new Namespace('', last, null);
            tr.push(parent);

            var names = namespace.split(".");

            for (var i = 0; i < names.length; i++) {
                var obj = null;

                if (last) {
                    var reg = /^(.*)\[(.*)\]/.exec(names[i]);
                    if (reg) {
                        obj = last[reg[1]][reg[2]];
                    } else {
                        obj = last[names[i]];
                    }
                }

                var nn = new Namespace(names[i], obj, parent);
                parent.next = nn;
                parent = nn;
                last = obj;
                tr.push(nn);
            }

            return tr;
        }

        public getLastValid(): Namespace {
            if (this.value)
                return this;
            else
                if (this.parent)
                    if (this.parent.value)
                        return this.parent;
                    else
                        return this.parent.getLastValid();
                else
                    null;
        }

        public fullNamespace(): string {
            if (this.next)
                return this.name + '.' + this.next.fullNamespace();
            else
                return this.name;
        }

        public hasValue(): boolean {
            return !!this.value;
        }
    }

    export function bootstrap(): void {
        ajax('/moc/home', null, 'GET', null, (err, data) => {
            if (err)
                throw err;

            var obj = JSON.parse(data);
            runObject(obj, document.body);
        });
    }

    export function runObject(obj: IObject, el: HTMLElement): void {
        var objEl: HTMLElement;
        var objInst: IObjectDef;

        if (obj._n) {
            var ns = Namespace.parse(obj._n);

            if (ns.length && !ns.last().hasValue())
                throw 'Missing class for namespace: {0}'.format(obj._n);

            var value = ns.last().value;
            objInst = new value();
            objEl = objInst.getObject(obj._v);
        }

        if (obj._c) {
            if (objInst && objInst.processChilds) {
                objInst.processChilds(objEl, obj._c);
            }
            else {
                for (var i = 0, c: IObject; c = obj._c[i]; i++) {
                    runObject(c, objEl);
                }
            }
        }

        if (objInst && objInst.preRender)
            objInst.preRender(objEl);

        if (objEl)
            el.appendChild(objEl);
    }
}

document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        document.body.style.display = "none";
    }
    else if (document.readyState == "complete") {
        moc.bootstrap();
        document.body.style.display = "";
    }
}