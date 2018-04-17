import * as Math2D from './math2d';

export class QuadTree {
    public root: QuadTreeGrid;
    public objs: QuadTreeArray<QuadTreeObject>;
    public maxObjects: number;
    public minObjects: number;

    public constructor(x: number, y: number, width: number, height: number) {
        this.root = new QuadTreeGrid(null, x, y, width, height);
        this.objs = new QuadTreeArray<QuadTreeObject>();
        this.maxObjects = 5;
        this.minObjects = 3;
    }

    public insert(obj: QuadTreeObject): void {
        this.checkInsert(obj, this.root);
        this.objs.set(obj);
    }

    private checkInsert(obj: QuadTreeObject, grid: QuadTreeGrid): void {
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

    private splitGrid(grid: QuadTreeGrid): void {
        let hx = grid.width / 2;
        let hy = grid.height / 2;
        grid.subs.sets([
            new QuadTreeGrid(grid, grid.x, grid.y, hx, hy),
            new QuadTreeGrid(grid, grid.x + hx + 1, grid.y, hx, hy),
            new QuadTreeGrid(grid, grid.x, grid.y + hy + 1, hx, hy),
            new QuadTreeGrid(grid, grid.x + hx + 1, grid.y + hy + 1, hx, hy)
        ]);
        grid.isObjs = false;
        grid.objs.each(obj => obj.grids.remove(grid));
        grid.objs.each(obj => this.checkInsert(obj, grid));
        grid.objs.clear();
    }

    public getObjects(rect: Math2D.IRectangle): QuadTreeArray<QuadTreeObject> {
        let tr = new QuadTreeArray<QuadTreeObject>();
        this.checkGetObjects(tr, rect, this.root);
        return tr;
    }

    private checkGetObjects(array: QuadTreeArray<QuadTreeObject>, rect: Math2D.IRectangle, grid: QuadTreeGrid): void {
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

    public remove(obj: QuadTreeObject): void {
        if (!this.objs.has(obj))
            return;

        obj.grids.each(grid => {
            grid.objs.remove(obj);
            this.checkMergeGrid(grid);
        });
        obj.grids.clear();
        this.objs.remove(obj);
    }

    private checkMergeGrid(grid: QuadTreeGrid): void {
        if (!grid.parent)
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

    private mergeGrid(grid: QuadTreeGrid): void {
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

    public changePosition(obj: QuadTreeObject, pos: Math2D.IRectangle): void {
        let grids = new QuadTreeArray<QuadTreeGrid>();
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

    private checkGrids(array: QuadTreeArray<QuadTreeGrid>, rect: Math2D.IRectangle, grid: QuadTreeGrid): void {
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

export class QuadTreeObject implements Math2D.IRectangle, IIndexable {
    public static idCount = 0;
    public grids: QuadTreeArray<QuadTreeGrid>;
    public id: number;

    public constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number) {

        this.grids = new QuadTreeArray<QuadTreeGrid>();
        this.id = QuadTreeObject.idCount++;
    }
}

export class QuadTreeGrid implements Math2D.IRectangle, IIndexable {
    public static idCount = 0;
    public objs: QuadTreeArray<QuadTreeObject>;
    public subs: QuadTreeArray<QuadTreeGrid>;
    public id: number;
    public isObjs: boolean;

    public constructor(
        public parent: QuadTreeGrid,
        public x: number,
        public y: number,
        public width: number,
        public height: number) {

        this.isObjs = true;
        this.objs = new QuadTreeArray<QuadTreeObject>();
        this.subs = new QuadTreeArray<QuadTreeGrid>();
        this.id = QuadTreeGrid.idCount++;
    }
}

export interface IIndexable {
    id: number;
}

export class QuadTreeArray<T extends IIndexable> {
    private items: { [id: number]: T };
    private len: number;

    public constructor() {
        this.len = 0;
        this.items = {};
    }

    public get length(): number { return this.len; }

    public set(item: T): void {
        if (!this.items[item.id]) {
            this.len++;
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
        return item.id in this.items;
    }

    public remove(item: T): void {
        if (item.id in this.items) {
            delete this.items[item.id];
            this.len--;
        }
    }

    public clear(): void {
        this.len = 0;
        this.items = {};
    }

    public each(func: (item: T) => void): void {
        for (let id in this.items) {
            func(this.items[id]);
        }
    }
}