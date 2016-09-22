
namespace singleLine {
    export class LCObject {
        public pos: LCPoint;
        public direction: boolean;
        public speed: number;

        constructor(
            public color: string) {
        }

        public collide(item: LCObject): boolean {
            return item.pos.pos == this.pos.pos;
        }
    }

    export class LCPoint {
        public back: LCPoint;
        public next: LCPoint;
        public objs: LCObject[];

        constructor(
            public id: number,
            public pos: number) {
            this.objs = [];
        }
    }

    export class LCArray {
        private _ids: number;
        private _center: number;

        public first: LCPoint;
        public last: LCPoint;

        constructor(low: number, high: number) {
            if (low >= high)
                throw `The high value need to be greater than low value`;

            this._ids = 0;
            let f = this.first = new LCPoint(this._ids++, low);
            let l = this.last = new LCPoint(this._ids++, high);
            this.adjustPoint2(f, l);

            this._center = (high - low) / 2;
        }

        public get center(): number { return this._center; }

        private adjustPoint2(first: LCPoint, last: LCPoint): void {
            first.next = last;
            last.back = first;
        }

        private adjustPoint3(first: LCPoint, middle: LCPoint, last: LCPoint): void {
            first.next = middle;
            middle.back = first;
            middle.next = last;
            last.back = middle;
        }

        public findFowardUntil(point: LCPoint, pos: number): LCPoint[] {
            let p = point.next, tr = [];
            while (p) {
                if (p.pos <= pos) {
                    tr.push(p);
                    p = p.next;
                }
                else {
                    return tr;
                }
            }
            return tr;
        }

        public insertFoward(base: LCPoint, pos: number): LCPoint {
            var b = base, p = base.next;
            while (p) {
                if (pos == p.pos) {
                    return p;
                }
                else if (pos < p.pos) {
                    let np = new LCPoint(this._ids++, pos);
                    this.adjustPoint3(b, np, p);
                    return np;
                }
                else {
                    b = p;
                    p = p.next;
                }
            }
            throw 'Something very wrong happen!';
        }

        public findBackUntil(point: LCPoint, pos: number): LCPoint[] {
            let p = point.back, tr = [];
            while (p) {
                if (p.pos >= pos) {
                    tr.push(p);
                    p = p.back;
                }
                else {
                    return tr;
                }
            }
            return tr;
        }

        public insertBack(base: LCPoint, pos: number): LCPoint {
            var b = base, p = base.back;
            while (p) {
                if (pos == p.pos) {
                    return p;
                }
                else if (pos > p.pos) {
                    let np = new LCPoint(this._ids++, pos);
                    this.adjustPoint3(p, np, b);
                    return np;
                }
                else {
                    b = p;
                    p = p.back;
                }
            }
            throw 'Something very wrong happen!';
        }

        public remove(point: LCPoint): void {
            point.back.next = point.next;
            point.next.back = point.back;
        }
    }

    // na função q inicia movimento, checar se não esta dando movimento para fora dos limites 
    export class LCField {
        private _yAxis: LCArray;
        private _oldTime: number;
        private _toAdd: Array<{ obj: LCObject, pos: number }>;

        public _objs: LCObject[];
        public paint: Function;

        constructor(low: number, high: number) {
            this._yAxis = new LCArray(low, high);
            this._objs = [];
            this._toAdd = [];
        }

        public add(obj: LCObject, pos: number): void {
            this._toAdd.push({ obj, pos });
        }

        public start(): void {
            this._oldTime = new Date().getTime();
            setTimeout(this.tick.bind(this), 1);
            //setInterval(this.tick.bind(this), 10);
        }

        private tick(): void {
            //debugger;
            let t = new Date().getTime();
            let d = t - this._oldTime;

            for (let toAdd of this._toAdd) {
                this.doAdd(toAdd.obj, toAdd.pos);
            }

            for (let obj of this._objs) {
                if (obj.speed > 0) {
                    let value = obj.speed * (d / 1000);
                    this.moveObj(obj, value);
                }
            }

            if (this.paint)
                this.paint();

            this._toAdd = [];
            this._oldTime = t;
            setTimeout(this.tick.bind(this), 1);
        }
        
        private doAdd(obj: LCObject, pos: number): void {
            let foward = pos < this._yAxis.center;
            let p: LCPoint;

            if (foward) {
                p = this._yAxis.insertFoward(this._yAxis.first, pos);
            }
            else {
                p = this._yAxis.insertBack(this._yAxis.last, pos);
            }

            if (p.objs.length > 0) {
                // existe um objeto no lugar onde ia ser adicionado, abortar
            }
            else {
                p.objs.push(obj);
                obj.pos = p;
                this._objs.push(obj);
            }
        }

        private moveObj(obj: LCObject, value: number): void {
            let ps: LCPoint[];

            if (obj.direction) {
                ps = this._yAxis.findFowardUntil(obj.pos, obj.pos.pos + value);
            }
            else {
                ps = this._yAxis.findBackUntil(obj.pos, obj.pos.pos + value);
            }

            if (ps.length == 0) {
                obj.pos.pos += value * (obj.direction ? 1 : -1);
            }
            else {
                //debugger;
                if (obj.direction) {
                    obj.direction = false;
                    obj.pos.pos = ps[0].pos - 1;
                }
                else {
                    obj.direction = true;
                    obj.pos.pos = ps[0].pos + 1;
                }
            }
        }
    }


    export class Program {
        public static field: LCField;
        public static ctx: CanvasRenderingContext2D;
        public static el: HTMLCanvasElement;

        public static start(): void {
            let height = 10000;

            Program.el = window.document.createElement('canvas');
            Program.el.width = 100;
            Program.el.height = height;
            Program.ctx = Program.el.getContext('2d');
            window.document.body.appendChild(Program.el);

            Program.field = new LCField(0, height);
            Program.field.paint = Program.paint;

            //let id1 = new LCObject('rgb(255,0,0)');
            //id1.direction = true;
            //id1.speed = 50;
            //Program.field.add(id1, 70);

            //let id2 = new LCObject('rgb(0,255,0)');
            //id2.direction = true;
            //id2.speed = 30;
            //Program.field.add(id2, 50);

            //let id3 = new LCObject('rgb(0,0,255)');
            //id3.direction = false;
            //id3.speed = 10;
            //Program.field.add(id3, 30);

            for (let i = 0; i < 1000; i++) {
                //debugger;
                let id = new LCObject(`rgb(${Math.floor(Math.random() * 240)},${Math.floor(Math.random() * 240)},${Math.floor(Math.random() * 240)})`);
                id.direction = Math.random() < 0.5;
                id.speed = Math.random() * 100;
                Program.field.add(id, Math.random() * (height - 1));
            }

            Program.field.start();
        }

        public static paint(): void {
            Program.ctx.fillStyle = 'rgb(255,255,255)';
            Program.ctx.fillRect(0, 0, Program.el.width, Program.el.height);

            for (let obj of Program.field._objs) {
                Program.ctx.fillStyle = obj.color;
                Program.ctx.fillRect(0, obj.pos.pos, Program.el.width, 1);
            }
        }
    }


    export class Program2 {
        public static fields: LCField[];
        public static ctx: CanvasRenderingContext2D;
        public static el: HTMLCanvasElement;
        public static isPaint: boolean = false;

        public static start(): void {
            let height = 100000;
            let fields = 1;
            Program2.fields = [];

            if (Program2.isPaint) {
                Program2.el = window.document.createElement('canvas');
                Program2.el.width = 100 * fields;
                Program2.el.height = height;
                Program2.ctx = Program2.el.getContext('2d');
                window.document.body.appendChild(Program2.el);
            }

            for (let f = 0; f < fields; f++) {
                Program2.fields.push(new LCField(0, height));
                Program2.fields[f].paint = () => Program2.paint(f);

                for (let i = 0; i < 100000; i++) {
                    //debugger;
                    let id = new LCObject(`rgb(${Math.floor(Math.random() * 240)},${Math.floor(Math.random() * 240)},${Math.floor(Math.random() * 240)})`);
                    id.direction = Math.random() < 0.5;
                    id.speed = Math.random() * 100;
                    Program2.fields[f].add(id, Math.random() * (height - 1));
                }

                debugger;
                Program2.fields[f].start();
            }
        }

        public static paint(field: number): void {
            if (Program2.isPaint) {
                let el = window.document.createElement('canvas');
                el.width = 100;
                el.height = Program2.el.height;
                let ctx = el.getContext('2d');

                ctx.fillStyle = 'rgb(255,255,255)';
                ctx.fillRect(0, 0, 100, Program2.el.height);

                for (let obj of Program2.fields[field]._objs) {
                    ctx.fillStyle = obj.color;
                    ctx.fillRect(0, obj.pos.pos, 100, 1);
                }

                Program2.ctx.drawImage(ctx.canvas, field * 100, 0, 100, Program2.el.height);
            }
            Program2.drawfps();
        }

        private static _lastSecond: number;
        private static _value: number;

        public static drawfps(): void {
            let s = new Date().getSeconds();
            if (s != Program2._lastSecond) {
                let fds = document.getElementById('fps');
                fds.innerHTML = `Fps: ${Program2._value / Program2.fields.length}`;
                Program2._value = 0;
                Program2._lastSecond = s;
            }
            else {
                Program2._value++;
            }
        }
    }
}

document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        singleLine.Program2.start();
    }
}