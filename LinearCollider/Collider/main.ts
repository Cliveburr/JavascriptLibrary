import * as Math2D from './math2d';
import { QTField, TheObject } from './field';
import { QuadTreeObject, QuadTreeGrid } from './quadtree';

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
        // let quant = 10000;

        // var values = [];
        // let start = +new Date();
        // for (let i = 0; i < quant; i++) {
        //     values.push(new TheObject(i, 1, 1, 1, 'rgba(0, 0, 0, 0.3)'));
        // }
        // let end = +new Date();
        // console.log(`Setting array: ${end - start} ms'`);

        // start = +new Date();
        // for (let value of values) {
        //     let index = values.indexOf(value);
        //     let has = values[index];
        // }
        // end = +new Date();
        // console.log(`Indexof array: ${end - start} ms'`);

        // var dict = {};
        // start = +new Date();
        // for (let i = 0; i < quant; i++) {
        //     dict[i] = new TheObject(i, 1, 1, 1, 'rgba(0, 0, 0, 0.3)');
        // }
        // end = +new Date();
        // console.log(`Setting dictonary: ${end - start} ms'`);

        // start = +new Date();
        // for (let dic in dict) {
        //     let has = dict[dic];
        // }
        // end = +new Date();
        // console.log(`Getting dictonary: ${end - start} ms'`);
    }

    public static setObjs(): void {
        let height = 800, width = 1000;
        Program.field = new QTField(0, 0, width, height);

        if (Program.isPaint) {
            Program.el = window.document.createElement('canvas');
            Program.el.addEventListener('mousedown', Program.onmousedown, false);
            Program.el.width = width;
            Program.el.height = height;
            Program.ctx = Program.el.getContext('2d');
            window.document.body.appendChild(Program.el);
        }

        let id1 = new TheObject(10, 10, 10, 10, `rgba(0, 0, 0, 0.3)`, 'a');
        id1.velocity = { x: 5, y: 5 };
        Program.field.insert(id1);
        Program.field.startMove(id1);


        let id2 = new TheObject(50, 10, 10, 10, `rgba(255, 0, 0, 0.3)`, 'b');
        //id2.direction = true;
        //id2.speed = 10;
        Program.field.insert(id2);

        Program.field.start();
        if (Program.isPaint) {
            window.requestAnimationFrame(Program.paint);
        }
    }

    public static onmousedown(ev: MouseEvent): void {
        let y = ev.clientY - (ev.clientY - ev.offsetY), x = ev.clientX - (ev.clientX - ev.offsetX);

        let objs = Program.field.quadTree.getObjects({ x, y, width: 1, height: 1 });
        if (objs.length > 0) {
            objs.each(obj => Program.field.remove(obj));
        }
        else {
            let newObj = new TheObject(x, y, Program.rnd(5, 50), Program.rnd(5, 50), Program.randomColor(), Program.rndLetter());
            newObj.velocity = { x: Program.rnd(-30, 30), y: Program.rnd(-30, 30) };
            Program.field.insert(newObj);
            Program.field.startMove(newObj);
        }
    }

    public static randomColor(): string {
        return `rgb(${Program.rnd(10, 240)},${Program.rnd(10, 240)},${Program.rnd(10, 240)})`;
    }

    public static rnd(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static rndLetter(): string {
        return 'abcdefghijlmnopqrstuvxywzABCDEFGHIJLMNOPQRSTUVWXZ'[Program.rnd(0, 48)];
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
            let tobj = obj as TheObject;
            ctx.fillStyle = tobj.color;
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            ctx.strokeText(tobj.letter, tobj.x, tobj.y + 8)
        });

        Program.ctx.drawImage(ctx.canvas, 0, 0, Program.el.width, Program.el.height);
        Program.drawfps();
        window.requestAnimationFrame(Program.paint);
    }

    public static drawGrid(ctx: CanvasRenderingContext2D, grid: QuadTreeGrid): void {
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

// document.onreadystatechange = () => {
//     if (document.readyState == "complete") {
//         Program.start();
//     }
// }

Program.start();