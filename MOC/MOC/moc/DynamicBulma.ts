import moc = require('./MOC');

module internal {
    export class Layout implements moc.IObjectDef {
        public getObject(): moc.IObject {
            var tr: moc.IObject = {
                _n: 'moc.client.Layout',
                _v: {
                }
            };
            return tr;
        }
    }

    export class Input implements moc.IObjectDef {
        constructor(
            public label: string,
            public value?: string) {
        }

        public getObject(): moc.IObject {
            var tr: moc.IObject = {
                _n: 'moc.client.Input',
                _v: {
                    'label': this.label,
                    'value': this.value
                }
            };
            return tr;
        }
    }

    export class Form implements moc.IObjectDef {
        public childs: moc.IObjectDef[];

        constructor(
            public dependencie?: string) {
            this.childs = [];
        }

        public getObject(): moc.IObject {
            var tr: moc.IObject = {
                _n: 'moc.client.Form'
            };

            if (this.dependencie)
                tr._d = [this.dependencie];

            tr._c = [];

            for (var i = 0, c: moc.IObjectDef; c = this.childs[i]; i++) {
                tr._c.push(c.getObject());
            }

            return tr;
        }
    }
}

export = internal;