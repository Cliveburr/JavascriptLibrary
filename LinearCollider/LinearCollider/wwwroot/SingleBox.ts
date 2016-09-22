
namespace singleBox {
    export class LCObject {
        public low: LCPoint;
        public high: LCPoint;
        public direction: boolean;
        public speed: number;
        public startPos: ILCPosition;

        constructor(
            public color: string) {
        }

        public get len(): number {
            return this.high.pos - this.low.pos;
        }

        public intersect(obj: LCObject): boolean {
            //let gl = this.low.pos > obj.low.pos ? this.low.pos : obj.low.pos;
            //let mh = this.high.pos < obj.high.pos ? this.high.pos : obj.high.pos;
            //return mh - gl > 0;
            return obj.high.pos >= this.low.pos && this.high.pos >= obj.low.pos;
            //    || this.high.pos >= obj.low.pos && obj.high.pos >= this.low.pos;
            //return this.low.pos <= obj.high.pos && obj.low.pos <= this.high.pos
            //    && obj.low.pos <= this.high.pos && this.low.pos <= obj.high.pos;
        }

        public contains(point: LCPoint): boolean {
            return this.low.pos <= point.pos && point.pos <= this.high.pos;
        }

        public containsPos(pos: number): boolean {
            return this.low.pos <= pos && pos <= this.high.pos;
        }

        public center(): number {
            return (this.high.pos - this.low.pos) / 2;
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

        //public findFirstPointFoward(pos: number): LCPoint {
        //}

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

    export interface ILCPosition {
        low: number;
        high: number;
    }

    export class LCField {
        private _yAxis: LCArray;
        private _oldTime: number;
        private _toAdd: Array<{ obj: LCObject, pos: ILCPosition }>;
        private _interval;

        public _objs: LCObject[];
        public paint: Function;

        public get isRunning(): boolean { return !!this._interval; }

        constructor(low: number, high: number) {
            this._yAxis = new LCArray(low, high);
            this._objs = [];
            this._toAdd = [];
        }

        public add(obj: LCObject, pos: ILCPosition): void {
            if (pos.low > pos.high)
                throw `Obj low must be lower than high! { low: ${pos.low}, high: ${pos.high} }`;

            this._toAdd.push({ obj, pos });
        }

        public start(): void {
            this._oldTime = new Date().getTime();
            //setTimeout(this.tick.bind(this), 1);
            this._interval = setInterval(this.tick.bind(this), 2);
        }

        public pause(): void {
            clearInterval(this._interval);
            delete this._interval;
        }

        public continue(): void {
            this._interval = setInterval(this.tick.bind(this), 2);
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
            //setTimeout(this.tick.bind(this), 1);
        }

        public doAdd(obj: LCObject, pos: ILCPosition): void {
            obj.startPos = pos;
            let foward = (pos.low + (pos.high - pos.low)) < this._yAxis.center;
            let low: LCPoint, high: LCPoint;

            if (foward) {
                low = this._yAxis.insertFoward(this._yAxis.first, pos.low);
                high = this._yAxis.insertFoward(low, pos.high);
            }
            else {
                high = this._yAxis.insertBack(this._yAxis.last, pos.high);
                low = this._yAxis.insertBack(high, pos.low);
            }

            obj.low = low;
            obj.high = high;

            let colide = () => {
                console.log('colided');
                this._yAxis.remove(low);
                this._yAxis.remove(high);
                if (Program.retryAdd) {
                    let low = Math.random() * (this._yAxis.last.pos - this._yAxis.first.pos - obj.len);
                    this.add(obj, {
                        low: low,
                        high: low + obj.len
                    });
                }
            };

            if (low.objs.length > 0 || high.objs.length > 0) {
                colide();
                return;
            }

            if (low.back.objs.length > 0) {
                if (low.back.objs[0].intersect(obj)) {
                    colide();
                    return;
                }
            }

            if (low.next.objs.length > 0) {
                if (low.next.objs[0].intersect(obj)) {
                    colide();
                    return;
                }
            }

            if (high.next.objs.length > 0) {
                if (high.next.objs[0].intersect(obj)) {
                    colide();
                    return;
                }
            }

            if (high.back.objs.length > 0) {
                if (high.back.objs[0].intersect(obj)) {
                    colide();
                    return;
                }
            }

            low.objs.push(obj);
            high.objs.push(obj);
            this._objs.push(obj);
        }

        private moveObj(obj: LCObject, value: number): void {
            let ps: LCPoint[];

            if (obj.direction) {
                ps = this._yAxis.findFowardUntil(obj.high, obj.high.pos + value);
            }
            else {
                ps = this._yAxis.findBackUntil(obj.low, obj.low.pos + value);
            }

            if (ps.length == 0) {
                let plus = value * (obj.direction ? 1 : -1);
                obj.low.pos += plus;
                obj.high.pos += plus;
            }
            else {
                //debugger;
                if (obj.direction) {
                    obj.direction = false;
                    let diff = obj.high.pos - obj.low.pos;
                    obj.high.pos = ps[0].pos - 1;
                    obj.low.pos = obj.high.pos - diff;

                    if (ps[0].objs[0] && !ps[0].objs[0].direction)
                        ps[0].objs[0].direction = true;
                }
                else {
                    obj.direction = true;
                    let diff = obj.high.pos - obj.low.pos;
                    obj.low.pos = ps[0].pos + 1;
                    obj.high.pos = obj.low.pos + diff;

                    if (ps[0].objs[0] && ps[0].objs[0].direction)
                        ps[0].objs[0].direction = false;
                }
            }
        }

        public objectsIn(pos: number): LCObject[] {
            //let foward = pos < this._yAxis.center;
            let tr = [], bk: LCPoint;

            //if (foward) {
            //    bk = this._yAxis.findFirstPointFoward(pos).back;
            //}
            //else {
            //    bk = this._yAxis.findFirstPointBack(pos);
            //}

            for (let obj of this._objs) {
                if (obj.containsPos(pos))
                    tr.push(obj);
            }

            return tr;
        }
    }

    export class Program {
        public static fields: LCField[];
        public static ctx: CanvasRenderingContext2D;
        public static el: HTMLCanvasElement;
        public static isPaint: boolean = false;
        public static retryAdd: boolean = true;

        public static start(): void {
            //Program.setObjs();
            Program.setRandomObjs();

            window.onkeypress = Program.onkeypress;
        }

        public static onkeypress(ev: KeyboardEvent): void {
            if (ev.key == 'p') {
                for (let field of Program.fields) {
                    if (field.isRunning) {
                        field.pause();
                    }
                    else {
                        field.start();
                    }
                }
            }
        }

        public static onmousedown(ev: MouseEvent): void {
            let pos = ev.pageY - 18;
            for (let obj of Program.fields[0].objectsIn(pos)) {
                console.log(obj);
            }
        }

        public static setObjs(): void {
            let height = 1000;
            Program.fields = [new LCField(0, height)];

            if (Program.isPaint) {
                Program.el = window.document.createElement('canvas');
                Program.el.addEventListener('mousedown', Program.onmousedown);
                Program.el.width = 50;
                Program.el.height = height;
                Program.ctx = Program.el.getContext('2d');
                window.document.body.appendChild(Program.el);
            }

            Program.fields[0].paint = () => Program.paint(0);

            let id1 = new LCObject(`rgba(0, 0, 0, 0.3)`);
            id1.direction = false;
            id1.speed = 30;
            Program.fields[0].add(id1, {
                low: 400,
                high: 600
            });

            let id2 = new LCObject(`rgba(255, 0, 0, 0.3)`);
            id2.direction = true;
            id2.speed = 10;
            Program.fields[0].add(id2, {
                low: 400,
                high: 700
            });

            Program.fields[0].start();
        }


        public static setRandomObjs(): void {
            let height = 10000;
            let fields = 1;
            let maxSize = 30;
            Program.fields = [];

            if (Program.isPaint) {
                Program.el = window.document.createElement('canvas');
                Program.el.addEventListener('mousedown', Program.onmousedown);
                Program.el.width = 50 * fields;
                Program.el.height = height;
                Program.ctx = Program.el.getContext('2d');
                window.document.body.appendChild(Program.el);
            }

            for (let f = 0; f < fields; f++) {
                Program.fields.push(new LCField(0, height));
                Program.fields[f].paint = () => Program.paint(f);

                for (let i = 0; i < 1000; i++) {
                    //debugger;
                    let id = new LCObject(`rgb(${Math.floor(Math.random() * 240)},${Math.floor(Math.random() * 240)},${Math.floor(Math.random() * 240)})`);
                    id.direction = Math.random() < 0.5;
                    id.speed = Math.random() * 100;
                    let low = Math.random() * (height - maxSize);
                    let size = Math.random() * maxSize;
                    Program.fields[f].add(id, {
                        low: low,
                        high: low + size
                    });
                }

                //debugger;
                Program.fields[f].start();
            }
        }

        public static paint(field: number): void {
            if (Program.isPaint) {
                let el = window.document.createElement('canvas');
                el.width = 50;
                el.height = Program.el.height;
                let ctx = el.getContext('2d');

                ctx.fillStyle = 'rgb(255,255,255)';
                ctx.fillRect(0, 0, 50, Program.el.height);

                for (let obj of Program.fields[field]._objs) {
                    ctx.fillStyle = obj.color;
                    ctx.fillRect(0, obj.low.pos, 50, obj.high.pos - obj.low.pos);
                }

                Program.ctx.drawImage(ctx.canvas, field * 50, 0, 50, Program.el.height);
            }
            Program.drawfps();
        }

        private static _lastSecond: number;
        private static _value: number;

        public static drawfps(): void {
            let s = new Date().getSeconds();
            if (s != Program._lastSecond) {
                let fds = document.getElementById('fps');
                fds.innerHTML = `Fps: ${Program._value / Program.fields.length}`;
                Program._value = 0;
                Program._lastSecond = s;
            }
            else {
                Program._value++;
            }
        }
    }
}

document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        singleBox.Program.start();
    }
}