
namespace TwoDPointSegmentTree {
    export interface IVector {
        x: number;
        y: number;
    }

    export interface IRectangle {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    export class LCObject implements IRectangle {
        public velocity: IVector;

        public constructor(
            public x: number,
            public y: number,
            public width: number,
            public height: number,
            public color: string) {
        }
    }

    export class LCPoint {
        public low: LCPoint;
        public high: LCPoint;
        public segs: SegmentArray;

        constructor(
            public pos: number) {
            this.segs = new SegmentArray();;
        }
    }

    export class LCArray {
        public low: LCPoint;
        public high: LCPoint;
        public center: number;

        constructor(low: number, high: number) {
            this.low = new LCPoint(low);
            this.high = new LCPoint(high);

            this.low.high = this.high;
            this.high.low = this.low;

            this.center = (high - low) / 2;
        }

        private adjustPoint3(low: LCPoint, middle: LCPoint, high: LCPoint): void {
            low.high = middle;
            middle.low = low;
            middle.high = high;
            high.low = middle;
        }

        public pointAt(pos: number): LCPoint {
            return pos < this.center ?
                this.pointFromLow(pos) :
                this.pointFromHigh(pos);
        }

        private pointFromLow(pos: number): LCPoint {
            var b = this.low, p = this.low.high;
            while (p) {
                if (pos == p.pos) {
                    return p;
                }
                else if (pos < p.pos) {
                    let np = new LCPoint(pos);
                    this.adjustPoint3(b, np, p);
                    return np;
                }
                else {
                    b = p;
                    p = p.high;
                }
            }
            throw 'pointFromLow wrong';
        }

        private pointFromHigh(pos: number): LCPoint {
            var b = this.high, p = this.high.low;
            while (p) {
                if (pos == p.pos) {
                    return p;
                }
                else if (pos > p.pos) {
                    let np = new LCPoint(pos);
                    this.adjustPoint3(p, np, b);
                    return np;
                }
                else {
                    b = p;
                    p = p.low;
                }
            }
            throw 'pointFromHigh wrong';
        }

        public pointsFromTo(from: LCPoint, to: number): LCPoint[] {
            return from.pos < to ?
                this.findAboveUntil(from, to) :
                this.findBelowUntil(from, to);
        }

        private findAboveUntil(from: LCPoint, to: number): LCPoint[] {
            let p = from.high, tr = [];
            while (p) {
                if (p.pos <= to) {
                    tr.push(p);
                    p = p.high;
                }
                else {
                    return tr;
                }
            }
            return tr;
        }

        private findBelowUntil(from: LCPoint, to: number): LCPoint[] {
            let p = from.low, tr = [];
            while (p) {
                if (p.pos >= to) {
                    tr.push(p);
                    p = p.low;
                }
                else {
                    return tr;
                }
            }
            return tr;
        }

        public pointsFromToN(from: number, to: number): LCPoint[] {
            if (from < to) {
                return from < this.center ?
                    this.findFromLowTo(from, to) :
                    this.findFromHighTo(from, to);
            }
            else {
                return from < this.center ?
                    this.findFromLowTo(to, from) :
                    this.findFromHighTo(to, from);
            }
        }

        private findFromLowTo(low: number, high: number): LCPoint[] {
            let p = this.low, tr: Array<LCPoint>;
            while (p) {
                if (tr) {
                    if (high <= p.pos)
                        tr.push(p);
                    else
                        break;
                }
                else {
                    if (low >= p.pos)
                        tr = [p];
                }
                p = p.high;
            }
            return tr || [];
        }

        private findFromHighTo(low: number, high: number): LCPoint[] {
            let p = this.high, tr: Array<LCPoint>;
            while (p) {
                if (tr) {
                    if (low >= p.pos)
                        tr.push(p);
                    else
                        break;
                }
                else {
                    if (high <= p.pos)
                        tr = [p];
                }
                p = p.low;
            }
            return tr || [];
        }

        public remove(point: LCPoint): void {
            point.low.high = point.high;
            point.high.low = point.low;
        }
    }

    export interface ISegment {
        start: number;
        end: number;
    }

    export class SegmentArray {
        private array: Array<Array<ISegment>>;

        public constructor(
            private start: number,
            private end: number,
            private bucketSize: number) {
            let len = end - start;
            let buckets = Math.ceil(len / bucketSize);
            this.array = new Array(buckets);
        }

        private hash(key: number): number {
            return Math.floor((key - this.start) / this.bucketSize);
        }

        private bucket(key: number): Array<ISegment> {
            let h = this.hash(key);
            let b = this.array[h];
            if (!b) {
                b = [];
                this.array[h] = b;
            }
            return b;
        }

        public add(seg: ISegment): boolean {
            let b = this.bucket(seg.start);
            for (let i = 0; i < b.length; i++) {
                if (seg.start >= b[i].start) {
                    if (seg.end <= b[i].end)
                        return false;
                }
                else {
                    if (seg.end < b[i].start) {
                        b.splice(i, 0, seg);
                        return true;
                    }
                    else
                        return false;
                }
            }
            b.push(seg);
            return true;
        }

        public remove(seg: ISegment): void {
            let b = this.bucket(seg.start);
            let i = b.indexOf(seg);
            if (i > -1)
                b.splice(i, 1);
        }

        public findByPoint(point: number): ISegment {
            let b = this.bucket(point);
            for (let i = 0; i < b.length; i++) {
                if (point >= b[i].start && point <= b[i].end) {
                    return b[i];
                }
            }
            return null;
        }

        public findBySegment(start: number, end: number): Array<ISegment> {
            let b = this.bucket(start);
            let tr: Array<ISegment>;
            for (let i = 0; i < b.length; i++) {
                if (tr) {
                    if (b[i].end <= end)
                        tr.push(b[i]);
                    else
                        break;
                }
                else {
                    if (b[i].start >= start)
                        tr = [b[i]];
                }
            }
            return tr || [];
        }
    }

    export enum LCFieldActionType {
        Insert,
        Remove,
        Move
    }

    export class LCFieldAction {
        public type: LCFieldActionType;
        public obj: LCObject;
        public persist: boolean;
    }

    export class LCField {
        public xAxis: LCArray;
        public yAxis: LCArray;
        public objs: Array<LCObject>;
        public running: boolean;
        public ticksPerSecond: number;

        private lastSecond: number;
        private ticks: number;
        private oldTime: number;
        private actions: Array<LCFieldAction>;

        constructor(x: number, y: number, width: number, height: number) {
            this.xAxis = new LCArray(x, width);
            this.yAxis = new LCArray(y, height);
            this.objs = [];
            this.actions = [];
        }

        public start(): void {
            this.oldTime = new Date().getTime();
            this.running = true;
            setTimeout(this.tick.bind(this), 1);
        }

        public pause(): void {
            this.running = false;
        }

        public continue(): void {
            this.running = true;
            setTimeout(this.tick.bind(this), 1);
        }

        private tick(): void {
            let t = new Date().getTime();
            let d = t - this.oldTime;

            for (let i = 0; i < this.actions.length; i++) {
                let action = this.actions[i];
                switch (action.type) {
                    case LCFieldActionType.Insert:
                        this.doInsert(action);
                        break;
                    case LCFieldActionType.Remove:
                        this.doRemove(action);
                        break;
                    case LCFieldActionType.Move:
                        this.doMove(action, d);
                        break;
                }
                if (!action.persist) {
                    let index = this.actions.indexOf(action);
                    this.actions.splice(index, 1);
                    i--;
                }
            }

            this.oldTime = t;
            this.calcTick();
            if (this.running)
                setTimeout(this.tick.bind(this), 1);
        }

        public insert(obj: LCObject): void {
            this.actions.push({
                type: LCFieldActionType.Insert,
                obj: obj,
                persist: false
            });
        }

        public remove(obj: LCObject): void {
            this.actions.push({
                type: LCFieldActionType.Remove,
                obj: obj,
                persist: false
            });
        }

        public startMove(obj: LCObject): void {
            this.actions.push({
                type: LCFieldActionType.Move,
                obj: obj,
                persist: true
            });
        }

        private calcTick(): void {
            let s = new Date().getSeconds();
            if (s != this.lastSecond) {
                this.ticksPerSecond = this.ticks;
                this.ticks = 0;
                this.lastSecond = s;
            }
            else {
                this.ticks++;
            }
        }

        private doInsert(action: LCFieldAction): void {
            if (this.checkCollideRectangle(action.obj)) {
            }
        }

        private doRemove(action: LCFieldAction): void {
            this.quadTree.remove(action.obj);
        }

        private doMove(action: LCFieldAction, diff: number): void {
            //let obj = action.obj;

            //let newPos = {
            //    x: obj.x + (obj.velocity.x * diff / 1000),
            //    y: obj.y + (obj.velocity.y * diff / 1000),
            //    width: action.obj.width,
            //    height: action.obj.height
            //};

            //let cols = this.quadTree.getObjects(newPos);

            //if (cols.length > 1) {
            //    console.log('colide');
            //}

            //this.quadTree.changePosition(obj, newPos);
        }

        public checkCollideRectangle(rect: IRectangle): boolean {
            let xps = this.xAxis.pointsFromToN(rect.x, rect.x + rect.width);
            for (let xp of xps) {
                if (xp.segs.findBySegment(rect.x, rect.x + rect.width).length > 0)
                    return true;
            }
            let yps = this.yAxis.pointsFromToN(rect.y, rect.y + rect.height);
            for (let yp of yps) {
                if (yp.segs.findBySegment(rect.y, rect.y + rect.height).length > 0)
                    return true;
            }
            return false;
        }
    }

    export class Program {
        public static width: number = 800;
        public static height: number = 1000;
        public static isPaint: boolean = true;

        public static field: LCField;
        public static ctx: CanvasRenderingContext2D;
        public static el: HTMLCanvasElement;

        public static start(): void {
            if (Program.isPaint) {
                Program.el = window.document.createElement('canvas');
                //Program.el.addEventListener('mousedown', Program.onmousedown);
                Program.el.width = Program.width;
                Program.el.height = Program.height;
                Program.ctx = Program.el.getContext('2d');
                window.document.body.appendChild(Program.el);
            }

            Program.setObjs();
            //Program.setRandomObjs();

            //window.onkeypress = Program.onkeypress;

            Program.field.start();
            if (Program.isPaint) {
                window.requestAnimationFrame(Program.paint);
            }
        }

        public static setObjs(): void {
            Program.field = new LCField(0, 0, Program.width, Program.height);

            let id1 = new LCObject(10, 10, 10, 10, `rgba(0, 0, 0, 0.3)`);
            Program.field.insert(id1);
            //id1.velocity = { x: 5, y: 5 };
            //Program.field.startMove(id1);


            let id2 = new LCObject(50, 10, 10, 10, `rgba(255, 0, 0, 0.3)`);
            //id2.direction = true;
            //id2.speed = 10;
            Program.field.insert(id2);
        }

        public static paint(field: number): void {
            let el = window.document.createElement('canvas');
            el.width = Program.el.width;
            el.height = Program.el.height;
            let ctx = el.getContext('2d');

            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.fillRect(0, 0, Program.el.width, Program.el.height);

            for (let obj of Program.field.objs) {
                ctx.fillStyle = obj.color;
                ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            };

            Program.ctx.drawImage(ctx.canvas, 0, 0, Program.el.width, Program.el.height);
            Program.drawfps();
            window.requestAnimationFrame(Program.paint);
        }

        public static drawfps(): void {
            let fds = document.getElementById('fps');
            fds.innerHTML = `Fps: ${Program.field.ticksPerSecond}`;
        }
    }
}

document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        TwoDPointSegmentTree.Program.start();
    }
}