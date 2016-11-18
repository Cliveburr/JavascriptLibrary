
//namespace TwoDPoint {

//    export interface ILCVector {
//        x: number;
//        y: number;
//    }

//    export class LCObject {
//        public point: LCPoint;
//        public velocity: ILCVector;

//        public constructor(
//            public color: string) {
//        }

//        public collide(item: LCObject): boolean {
//            return this.point.pos.x == item.point.pos.x
//                && this.point.pos.y == item.point.pos.y;
//        }
//    }

//    export class LCPoint {
//        public low: LCPoint;
//        public high: LCPoint;
//        public objs: LCObject[];

//        public constructor(
//            public pos: number) {
//        }
//    }

//    export abstract class LCArray {
//        public low: LCPoint;
//        public high: LCPoint;
//        public center: number;

//        constructor(low: number, high: number) {
//            this.low = new LCPoint(low);
//            this.high = new LCPoint(high);

//            this.low.high = this.high;
//            this.high.low = this.low;

//            this.center = (high - low) / 2;
//        }

//        private adjustPoint3(low: LCPoint, middle: LCPoint, high: LCPoint): void {
//            low.high = middle;
//            middle.low = low;
//            middle.high = high;
//            high.low = middle;
//        }

//        public pointAt(pos: number): LCPoint {
//            return pos < this.center ?
//                this.pointFromLow(pos) :
//                this.pointFromHigh(pos);
//        }

//        private pointFromLow(pos: number): LCPoint {
//            var b = this.low, p = this.low.high;
//            while (p) {
//                if (pos == p.pos) {
//                    return p;
//                }
//                else if (pos < p.pos) {
//                    let np = new LCPoint(pos);
//                    this.adjustPoint3(b, np, p);
//                    return np;
//                }
//                else {
//                    b = p;
//                    p = p.high;
//                }
//            }
//            throw 'pointFromLow wrong';
//        }

//        private pointFromHigh(pos: number): LCPoint {
//            var b = this.high, p = this.high.low;
//            while (p) {
//                if (pos == p.pos) {
//                    return p;
//                }
//                else if (pos > p.pos) {
//                    let np = new LCPoint(pos);
//                    this.adjustPoint3(p, np, b);
//                    return np;
//                }
//                else {
//                    b = p;
//                    p = p.low;
//                }
//            }
//            throw 'pointFromHigh wrong';
//        }

//        public pointsFromTo(from: LCPoint, to: number): LCPoint[] {
//            return from.pos < to ?
//                this.findAboveUntil(from, to) :
//                this.findBelowUntil(from, to);
//        }

//        private findAboveUntil(from: LCPoint, to: number): LCPoint[] {
//            let p = from.high, tr = [];
//            while (p) {
//                if (p.pos <= to) {
//                    tr.push(p);
//                    p = p.high;
//                }
//                else {
//                    return tr;
//                }
//            }
//            return tr;
//        }

//        private findBelowUntil(from: LCPoint, to: number): LCPoint[] {
//            let p = from.low, tr = [];
//            while (p) {
//                if (p.pos >= to) {
//                    tr.push(p);
//                    p = p.low;
//                }
//                else {
//                    return tr;
//                }
//            }
//            return tr;
//        }

//        public remove(point: LCPoint): void {
//            point.low.high = point.high;
//            point.high.low = point.low;
//        }
//    }

//    export class LCField {
//        private xaxis: LCArray;

//        private _toAdd: Array<{ obj: LCObject, pos: ILCVector }>;
//        private _oldTime: number;
//        private _interval;

//        public objs: LCObject[];
//        public paint: Function;

//        public constructor(x: number, y: number, height: number, width: number) {
//            this.entry = new LCArrayY(x, y, height, width);
//        }

//        public add(obj: LCObject, pos: ILCVector): void {
//            this._toAdd.push({ obj, pos });
//        }

//        public start(): void {
//            this._oldTime = new Date().getTime();
//            this._interval = setTimeout(this.tick.bind(this), 1);
//        }

//        public pause(): void {
//            clearInterval(this._interval);
//            delete this._interval;
//        }

//        public continue(): void {
//            this._interval = setTimeout(this.tick.bind(this), 1);
//        }

//        private tick(): void {
//            let t = new Date().getTime();
//            let d = t - this._oldTime;

//            for (let toAdd of this._toAdd) {
//                this.doAdd(toAdd.obj, toAdd.pos);
//            }

//            for (let obj of this.objs) {
//                if (obj.speed > 0) {
//                    let value = obj.speed * (d / 1000);
//                    this.moveObj(obj, value);
//                }
//            }

//            if (this.paint)
//                this.paint();

//            this._toAdd = [];
//            this._oldTime = t;
//            this._interval = setTimeout(this.tick.bind(this), 1);
//        }

//        public doAdd(obj: LCObject, pos: ILCVector): void {
//            let isYlow = pos.y < this.entry.centerY;
//            let arrayY = isYlow ?
//                this.entry.insertFromLow(pos.y) :
//                this.entry.insertFromHigh(pos.y);

//            let isXlow = pos.x < this.entry.centerX;
//            let point = isXlow ?
//                arrayY.


//            let y = this.doAxisAdd(this._yAxis, pos.ylow, pos.yhigh);
//            let x = this.doAxisAdd(this._xAxis, pos.xlow, pos.xhigh);


//            obj.low = low;
//            obj.high = high;

//            let colide = () => {
//                console.log('colided');
//                this._yAxis.remove(low);
//                this._yAxis.remove(high);
//                if (Program.retryAdd) {
//                    let low = Math.random() * (this._yAxis.last.pos - this._yAxis.first.pos - obj.len);
//                    this.add(obj, {
//                        low: low,
//                        high: low + obj.len
//                    });
//                }
//            };

//            if (low.objs.length > 0 || high.objs.length > 0) {
//                colide();
//                return;
//            }

//            if (low.back.objs.length > 0) {
//                if (low.back.objs[0].intersect(obj)) {
//                    colide();
//                    return;
//                }
//            }

//            if (low.next.objs.length > 0) {
//                if (low.next.objs[0].intersect(obj)) {
//                    colide();
//                    return;
//                }
//            }

//            if (high.next.objs.length > 0) {
//                if (high.next.objs[0].intersect(obj)) {
//                    colide();
//                    return;
//                }
//            }

//            if (high.back.objs.length > 0) {
//                if (high.back.objs[0].intersect(obj)) {
//                    colide();
//                    return;
//                }
//            }

//            low.objs.push(obj);
//            high.objs.push(obj);
//            this._objs.push(obj);
//        }

//        private doAxisAdd(axis: LCArray, nlow: number, nhigh: number): { low: LCPoint, high: LCPoint } {
//            let foward = (nlow + (nhigh - nlow)) < axis.center;
//            let low: LCPoint, high: LCPoint;

//            if (foward) {
//                low = axis.insertFoward(axis.first, nlow);
//                high = axis.insertFoward(low, nhigh);
//            }
//            else {
//                high = axis.insertBack(axis.last, nhigh);
//                low = axis.insertBack(high, nlow);
//            }

//            if (low.objs.length > 0 || high.objs.length > 0) {
//                colide();
//                return;
//            }

//            if (low.back.objs.length > 0) {
//                if (low.back.objs[0].intersect(obj)) {
//                    colide();
//                    return;
//                }
//            }

//            if (low.next.objs.length > 0) {
//                if (low.next.objs[0].intersect(obj)) {
//                    colide();
//                    return;
//                }
//            }

//            if (high.next.objs.length > 0) {
//                if (high.next.objs[0].intersect(obj)) {
//                    colide();
//                    return;
//                }
//            }

//            if (high.back.objs.length > 0) {
//                if (high.back.objs[0].intersect(obj)) {
//                    colide();
//                    return;
//                }
//            }
//        }

//        private moveObj(obj: LCObject, value: number): void {
//            let ps: LCPoint[];

//            if (obj.direction) {
//                ps = this._yAxis.findFowardUntil(obj.high, obj.high.pos + value);
//            }
//            else {
//                ps = this._yAxis.findBackUntil(obj.low, obj.low.pos + value);
//            }

//            if (ps.length == 0) {
//                let plus = value * (obj.direction ? 1 : -1);
//                obj.low.pos += plus;
//                obj.high.pos += plus;
//            }
//            else {
//                //debugger;
//                if (obj.direction) {
//                    obj.direction = false;
//                    let diff = obj.high.pos - obj.low.pos;
//                    obj.high.pos = ps[0].pos - 1;
//                    obj.low.pos = obj.high.pos - diff;

//                    if (ps[0].objs[0] && !ps[0].objs[0].direction)
//                        ps[0].objs[0].direction = true;
//                }
//                else {
//                    obj.direction = true;
//                    let diff = obj.high.pos - obj.low.pos;
//                    obj.low.pos = ps[0].pos + 1;
//                    obj.high.pos = obj.low.pos + diff;

//                    if (ps[0].objs[0] && ps[0].objs[0].direction)
//                        ps[0].objs[0].direction = false;
//                }
//            }
//        }

//        public objectsIn(pos: number): LCObject[] {
//            //let foward = pos < this._yAxis.center;
//            let tr = [], bk: LCPoint;

//            //if (foward) {
//            //    bk = this._yAxis.findFirstPointFoward(pos).back;
//            //}
//            //else {
//            //    bk = this._yAxis.findFirstPointBack(pos);
//            //}

//            for (let obj of this._objs) {
//                if (obj.containsPos(pos))
//                    tr.push(obj);
//            }

//            return tr;
//        }
//    }

//    export class Program {
//        public static field: LCField;
//        public static ctx: CanvasRenderingContext2D;
//        public static el: HTMLCanvasElement;
//        public static isPaint: boolean = false;

//        private static lastSecond: number;
//        private static value: number;

//        public static start(): void {
//            Program.setObjs();
//            Program.field.start();
//        }

//        public static setObjs(): void {
//            let height = 500, width = 500;
//            Program.field = new LCField(0, 0, height, width);

//            if (Program.isPaint) {
//                Program.el = window.document.createElement('canvas');
//                //Program.el.addEventListener('mousedown', Program.onmousedown);
//                Program.el.width = width * 2;
//                Program.el.height = height * 2;
//                Program.ctx = Program.el.getContext('2d');
//                window.document.body.appendChild(Program.el);
//            }

//            Program.field.paint = Program.paint;

//            let id1 = new LCObject(`rgba(0, 0, 0, 0.3)`);
//            id1.velocity = { x: 0, y: 0 };
//            Program.field.add(id1, { x: 100, y: 200 });

//            let id2 = new LCObject(`rgba(255, 0, 0, 0.3)`);
//            id2.velocity = { x: 10, y: 0 };
//            Program.field.add(id2, { x: 100, y: 300 });
//        }

//        public static paint(): void {
//            if (Program.isPaint) {
//                let el = window.document.createElement('canvas');
//                el.width = Program.el.width;
//                el.height = Program.el.height;
//                let ctx = el.getContext('2d');

//                ctx.fillStyle = 'rgb(255,255,255)';
//                ctx.fillRect(0, 0, Program.el.width, Program.el.height);

//                for (let obj of Program.field.objs) {
//                    ctx.fillStyle = obj.color;
//                    ctx.fillRect(
//                        obj.pos.xlow.pos,
//                        obj.pos.ylow.pos,
//                        obj.pos.xhigh.pos - obj.pos.xlow.pos,
//                        obj.pos.yhigh.pos - obj.pos.ylow.pos);
//                }

//                Program.ctx.drawImage(ctx.canvas, 0, 0, Program.el.width, Program.el.height);
//            }
//            Program.drawfps();
//        }

//        public static drawfps(): void {
//            let s = new Date().getSeconds();
//            if (s != Program.lastSecond) {
//                let fds = document.getElementById('fps');
//                fds.innerHTML = `Fps: ${Program.value}`;
//                Program.value = 0;
//                Program.lastSecond = s;
//            }
//            else {
//                Program.value++;
//            }
//        }
//    }
//}

//document.onreadystatechange = () => {
//    if (document.readyState == "complete") {
//        TwoDPoint.Program.start();
//    }
//}




////export abstract class LCArray {
////    public low: LCPoint;
////    public high: LCPoint;
////    public center: number;

////    constructor(low: number, high: number) {
////        this.low = new LCPoint(low);
////        this.high = new LCPoint(high);

////        this.low.high = this.high;
////        this.high.low = this.low;

////        this.center = (high - low) / 2;
////    }

////    private adjustPoint3(low: LCPoint, middle: LCPoint, high: LCPoint): void {
////        low.high = middle;
////        middle.low = low;
////        middle.high = high;
////        high.low = middle;
////    }

////    public pointAt(pos: number): LCPoint {
////        return pos < this.center ?
////            this.pointFromLow(pos) :
////            this.pointFromHigh(pos);
////    }

////    private pointFromLow(pos: number): LCPoint {
////        var b = this.low, p = this.low.high;
////        while (p) {
////            if (pos == p.pos) {
////                return p;
////            }
////            else if (pos < p.pos) {
////                let np = new LCPoint(pos);
////                this.adjustPoint3(b, np, p);
////                return np;
////            }
////            else {
////                b = p;
////                p = p.high;
////            }
////        }
////        throw 'pointFromLow wrong';
////    }

////    private pointFromHigh(pos: number): LCPoint {
////        var b = this.high, p = this.high.low;
////        while (p) {
////            if (pos == p.pos) {
////                return p;
////            }
////            else if (pos > p.pos) {
////                let np = new LCPoint(pos);
////                this.adjustPoint3(p, np, b);
////                return np;
////            }
////            else {
////                b = p;
////                p = p.low;
////            }
////        }
////        throw 'pointFromHigh wrong';
////    }

////    public pointsFromTo(from: LCPoint, to: number): LCPoint[] {
////        return from.pos < to ?
////            this.findAboveUntil(from, to) :
////            this.findBelowUntil(from, to);
////    }

////    private findAboveUntil(from: LCPoint, to: number): LCPoint[] {
////        let p = from.high, tr = [];
////        while (p) {
////            if (p.pos <= to) {
////                tr.push(p);
////                p = p.high;
////            }
////            else {
////                return tr;
////            }
////        }
////        return tr;
////    }

////    private findBelowUntil(from: LCPoint, to: number): LCPoint[] {
////        let p = from.low, tr = [];
////        while (p) {
////            if (p.pos >= to) {
////                tr.push(p);
////                p = p.low;
////            }
////            else {
////                return tr;
////            }
////        }
////        return tr;
////    }

////    public remove(point: LCPoint): void {
////        point.low.high = point.high;
////        point.high.low = point.low;
////    }
////}