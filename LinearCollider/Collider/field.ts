import * as Math2D from './math2d';
import { QuadTreeObject, QuadTree } from "./quadtree";

export enum QTFieldActionType {
    Insert,
    Remove,
    Move
}

export class QTFieldAction {
    public type: QTFieldActionType;
    public obj: QuadTreeObject;
    public persist: boolean;
}

export class TheObject extends QuadTreeObject {

    public velocity: Math2D.IVector;

    public constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        public color: string,
        public letter: string
    ) {
        super(x, y, width, height);
    }
}

export class QTField {
    public quadTree: QuadTree;
    public running: boolean;
    public ticksPerSecond: number;

    private lastSecond: number;
    private ticks: number;
    private oldTime: number;
    private actions: Array<QTFieldAction>;

    constructor(x: number, y: number, width: number, height: number) {
        this.quadTree = new QuadTree(x, y, width, height);
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

    public insert(obj: QuadTreeObject): void {
        this.actions.push({
            type: QTFieldActionType.Insert,
            obj: obj,
            persist: false
        });
    }

    public remove(obj: QuadTreeObject): void {
        this.actions.push({
            type: QTFieldActionType.Remove,
            obj: obj,
            persist: false
        });
    }

    public startMove(obj: QuadTreeObject): void {
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
        this.actions = this.actions.filter(a => a.obj !== action.obj);
    }

    private doMove(action: QTFieldAction, diff: number): void {
        let obj = action.obj as TheObject;

        let newPos = {
            x: obj.x + (obj.velocity.x * diff / 1000),
            y: obj.y + (obj.velocity.y * diff / 1000),
            width: action.obj.width,
            height: action.obj.height
        };

        let cols = this.quadTree.getObjects(newPos);

        if (cols.length > 1) {
            console.log('colide');
            obj.velocity.x *= -1;
            obj.velocity.y *= -1;
        }

        this.quadTree.changePosition(obj, newPos);
    }
}