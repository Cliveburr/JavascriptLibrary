
namespace TwoDPointQuadTree {

    export interface QTIVector {
        x: number;
        y: number;
    }

    export interface QTIRectangle {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    export class Math2D {
        public static intersect(r1: QTIRectangle, r2: QTIRectangle): Boolean {
            return !(r2.x > (r1.x + r1.width)
                || (r2.x + r2.width) < r1.x
                || r2.y > (r1.y + r1.height)
                || (r2.y + r2.height) < r1.y);
        }

        public static inside(container: QTIRectangle, test: QTIRectangle): Boolean {
            return (container.x < test.x)
                && (container.x + container.width > test.x + test.width)
                && (container.y < test.y)
                && (container.y + container.height > test.y + test.height);
        }
    }

    export interface QTIIndexable {
        id: number;
    }

    export class QTArray<T extends QTIIndexable> {
        private items: { [id: number]: T };
        private _l: number;

        public constructor() {
            this._l = 0;
            this.items = {};
        }

        public get length(): number { return this._l; }

        public set(item: T): void {
            if (!this.items[item.id]) {
                this._l++;
            }
            this.items[item.id] = item;
        }

        public sets(items: Array<T>): void {
            for (let item of items) {
                this.set(item);
            }
        }

        public get(id: number): T {
            return this.items[id];
        }

        public has(item: T): boolean {
            return !!this.items[item.id];
        }

        public remove(item: T): void {
            delete this.items[item.id];
            this._l--;
        }

        public clear(): void {
            this._l = 0;
            this.items = {};
        }

        public each(func: (item: T) => void): void {
            for (let id in this.items) {
                func(this.items[id]);
            }
        }
    }

    export class QTObject implements QTIRectangle, QTIIndexable {
        public static idCount = 0;
        public grid: QTGrid;
        public id: number;
        public velocity: QTIVector;

        public constructor(
            public x: number,
            public y: number,
            public width: number,
            public height: number,
            public color: string) {

            this.id = QTObject.idCount++;
            this.grid = null;
        }
    }

    export class QTGrid implements QTIRectangle {
        public static idCount = 0;
        public objs: QTArray<QTObject>;
        public subs: QTArray<QTGrid>;
        public id: number;

        public constructor(
            public parent: QTGrid,
            public x: number,
            public y: number,
            public width: number,
            public height: number) {

            this.objs = new QTArray<QTObject>();
            this.subs = new QTArray<QTGrid>();
            this.id = QTObject.idCount++;
        }
    }

    export class QTQuadTree {
        public root: QTGrid;
        public objs: QTArray<QTObject>;
        public maxObjects: number;
        public minObjects: number;

        public constructor(x: number, y: number, width: number, height: number) {
            this.root = new QTGrid(null, x, y, width, height);
            this.objs = new QTArray<QTObject>();
            this.maxObjects = 5;
            this.minObjects = 3;
        }

        public insert(obj: QTObject): void {
            this.checkInsert(obj, this.root);
            this.objs.set(obj);
        }

        private checkInsert(obj: QTObject, grid: QTGrid): void {
            if (!Math2D.inside(grid, obj))
                return;

            if (!Math2D.intersect(obj, grid))
                return;

            if (grid.isObjs) {
                if (grid.objs.length + 1 > this.maxObjects) {
                    this.splitGrid(grid);
                    grid.subs.each(sub => this.checkInsert(obj, sub));
                }
                else {
                    grid.objs.set(obj);
                    obj.grids.set(grid);
                }
            }
            else {
                grid.subs.each(sub => this.checkInsert(obj, sub));
            }
        }

        private splitGrid(grid: QTGrid): void {
            let hx = grid.width / 2;
            let hy = grid.height / 2;
            grid.subs.sets([
                new QTGrid(grid, grid.x, grid.y, hx, hy),
                new QTGrid(grid, grid.x + hx + 1, grid.y, hx, hy),
                new QTGrid(grid, grid.x, grid.y + hy + 1, hx, hy),
                new QTGrid(grid, grid.x + hx + 1, grid.y + hy + 1, hx, hy)
            ]);

            grid.isObjs = false;
            grid.objs.each(obj => {
                obj.grids.remove(grid);
                this.checkInsert(obj, grid);
            });
            grid.objs.clear();
        }

        public getObjects(rect: QTIRectangle): QTArray<QTObject> {
            let tr = new QTArray<QTObject>();
            this.checkGetObjects(tr, rect, this.root);
            return tr;
        }

        private checkGetObjects(array: QTArray<QTObject>, rect: QTIRectangle, grid: QTGrid): void {
            if (grid.isObjs) {
                grid.objs.each(obj => {
                    if (Math2D.intersect(obj, rect)) {
                        array.set(obj);
                    }
                });
            }
            else {
                grid.subs.each(sub => {
                    if (Math2D.intersect(sub, rect)) {
                        this.checkGetObjects(array, rect, sub);
                    }
                });
            }
        }

        public remove(obj: QTObject): void {
            if (!this.objs.has(obj))
                return;

            obj.grids.each(grid => {
                grid.objs.remove(obj);
                this.checkMergeGrid(grid);
            });
            obj.grids.clear();
            this.objs.remove(obj);
        }

        private checkMergeGrid(grid: QTGrid): void {
            if (!grid.parent || !grid.parent.subs)
                return;

            let count = 0;
            grid.parent.subs.each(sub => {
                if (sub.isObjs)
                    count += sub.objs.length;
                else
                    return;
            });

            if (count < this.minObjects) {
                this.mergeGrid(grid.parent);
            }
        }

        private mergeGrid(grid: QTGrid): void {
            grid.objs.clear();
            grid.subs.each(sub => {
                sub.objs.each(obj => {
                    obj.grids.remove(sub);
                    obj.grids.set(grid);
                    grid.objs.set(obj);
                });
                sub.objs = null;
                sub.subs = null;
                sub.parent = null;
            });
            grid.subs.clear();
            grid.isObjs = true;
        }

        public changePosition(obj: QTObject, pos: QTIRectangle): void {
            let grids = new QTArray<QTGrid>();
            this.checkGrids(grids, pos, this.root);
            obj.grids.each(grid => {
                if (!grids.has(grid)) {
                    obj.grids.remove(grid);
                    grid.objs.remove(obj);
                }
            });
            grids.each(grid => {
                if (!obj.grids.has(grid)) {
                    obj.grids.set(grid);
                    grid.objs.set(obj);
                }
            });
            obj.x = pos.x;
            obj.y = pos.y;
            obj.width = pos.width;
            obj.height = pos.height;
        }

        private checkGrids(array: QTArray<QTGrid>, rect: QTIRectangle, grid: QTGrid): void {
            if (grid.isObjs) {
                if (Math2D.intersect(grid, rect)) {
                    array.set(grid);
                }
            }
            else {
                grid.subs.each(sub => this.checkGrids(array, rect, sub));
            }
        }
    }

    export enum QTFieldActionType {
        Insert,
        Remove,
        Move
    }

    export class QTFieldAction {
        public type: QTFieldActionType;
        public obj: QTObject;
        public persist: boolean;
    }

    export class QTField {
        public quadTree: QTQuadTree;
        public running: boolean;
        public ticksPerSecond: number;

        private lastSecond: number;
        private ticks: number;
        private oldTime: number;
        private actions: Array<QTFieldAction>;

        constructor(x: number, y: number, width: number, height: number) {
            this.quadTree = new QTQuadTree(x, y, width, height);
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
                    case QTFieldActionType.Insert:
                        this.doInsert(action);
                        break;
                    case QTFieldActionType.Remove:
                        this.doRemove(action);
                        break;
                    case QTFieldActionType.Move:
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

        public insert(obj: QTObject): void {
            this.actions.push({
                type: QTFieldActionType.Insert,
                obj: obj,
                persist: false
            });
        }

        public remove(obj: QTObject): void {
            this.actions.push({
                type: QTFieldActionType.Remove,
                obj: obj,
                persist: false
            });
        }

        public startMove(obj: QTObject): void {
            this.actions.push({
                type: QTFieldActionType.Move,
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

        private doInsert(action: QTFieldAction): void {
            this.quadTree.insert(action.obj);
        }

        private doRemove(action: QTFieldAction): void {
            this.quadTree.remove(action.obj);
        }

        private doMove(action: QTFieldAction, diff: number): void {
            let obj = action.obj;

            let newPos = {
                x: obj.x + (obj.velocity.x * diff / 1000),
                y: obj.y + (obj.velocity.y * diff / 1000),
                width: action.obj.width,
                height: action.obj.height
            };

            let cols = this.quadTree.getObjects(newPos);

            if (cols.length > 1) {
                console.log('colide');
            }

            this.quadTree.changePosition(obj, newPos);
        }
    }


    export class Program {
        public static field: QTField;
        public static ctx: CanvasRenderingContext2D;
        public static el: HTMLCanvasElement;
        public static isPaint: boolean = true;
        public static retryAdd: boolean = true;
        public static drawGrids: boolean = true;

        public static start(): void {
            Program.setObjs();
            //Program.setRandomObjs();

            //window.onkeypress = Program.onkeypress;
            //Program.testArrays();
        }

        public static testArrays(): void {
            let quant = 10000;

            var values = [];
            let start = +new Date();
            for (let i = 0; i < quant; i++) {
                values.push(new QTObject(i, 1, 1, 1, 'rgba(0, 0, 0, 0.3)'));
            }
            let end = +new Date();
            console.log(`Setting array: ${end - start} ms'`);

            start = +new Date();
            for (let value of values) {
                let index = values.indexOf(value);
                let has = values[index];
            }
            end = +new Date();
            console.log(`Indexof array: ${end - start} ms'`);

            var dict = {};
            start = +new Date();
            for (let i = 0; i < quant; i++) {
                dict[i] = new QTObject(i, 1, 1, 1, 'rgba(0, 0, 0, 0.3)');
            }
            end = +new Date();
            console.log(`Setting dictonary: ${end - start} ms'`);

            start = +new Date();
            for (let dic in dict) {
                let has = dict[dic];
            }
            end = +new Date();
            console.log(`Getting dictonary: ${end - start} ms'`);
        }

        public static setObjs(): void {
            let height = 800, width = 1000;
            Program.field = new QTField(0, 0, width, height);

            if (Program.isPaint) {
                Program.el = window.document.createElement('canvas');
                Program.el.addEventListener('mousedown', Program.onmousedown);
                Program.el.width = width;
                Program.el.height = height;
                Program.ctx = Program.el.getContext('2d');
                window.document.body.appendChild(Program.el);
            }

            let id1 = new QTObject(10, 10, 10, 10, `rgba(0, 0, 0, 0.3)`);
            id1.velocity = { x: 5, y: 5 };
            Program.field.insert(id1);
            Program.field.startMove(id1);


            let id2 = new QTObject(50, 10, 10, 10, `rgba(255, 0, 0, 0.3)`);
            //id2.direction = true;
            //id2.speed = 10;
            Program.field.insert(id2);

            Program.field.start();
            if (Program.isPaint) {
                window.requestAnimationFrame(Program.paint);
            }
        }

        public static onmousedown(ev: MouseEvent): void {
            let y = ev.pageY - 18, x = ev.pageX;

            let objs = Program.field.quadTree.getObjects({ x, y, width: 1, height: 1 });
            if (objs.length > 0) {
                objs.each(obj => Program.field.remove(obj));
            }
            else {
                Program.field.insert(new QTObject(x, y, Program.rnd(5, 50), Program.rnd(5, 50), Program.randomColor()));
            }
        }

        public static randomColor(): string {
            return `rgb(${Program.rnd(10, 240)},${Program.rnd(10, 240)},${Program.rnd(10, 240)})`;
        }

        public static rnd(min: number, max: number): number {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        public static paint(field: number): void {
            let el = window.document.createElement('canvas');
            el.width = Program.el.width;
            el.height = Program.el.height;
            let ctx = el.getContext('2d');

            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.fillRect(0, 0, Program.el.width, Program.el.height);

            if (Program.drawGrids) {
                Program.drawGrid(ctx, Program.field.quadTree.root);
            }

            Program.field.quadTree.objs.each(obj => {
                ctx.fillStyle = obj.color;
                ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            });

            Program.ctx.drawImage(ctx.canvas, 0, 0, Program.el.width, Program.el.height);
            Program.drawfps();
            window.requestAnimationFrame(Program.paint);
        }

        public static drawGrid(ctx: CanvasRenderingContext2D, grid: QTGrid): void {
            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.strokeRect(grid.x, grid.y, grid.width, grid.height);
            if (grid.subs) {
                grid.subs.each(sub => {
                    Program.drawGrid(ctx, sub);
                });
            }
        }

        public static drawfps(): void {
            let fds = document.getElementById('fps');
            fds.innerHTML = `Fps: ${Program.field.ticksPerSecond}`;
        }
    }
}

document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        TwoDPointQuadTree.Program.start();
    }
}