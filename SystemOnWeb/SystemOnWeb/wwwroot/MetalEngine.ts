
module MetalEngine {
    export class Engine {
        private _inputs: InputManager;
        private _renderer: RendererManager;
        private _object: ObjectManager;

        constructor() {
            this.initInputs();
            this.initRenderer();
            this.initObject();
        }

        private initInputs(): void {
            this._inputs = new InputManager();
            Sow.send('me.input.add', Keyboard);
            Sow.send('me.input.add', Mouse);
        }

        private initRenderer(): void {
            this._renderer = new RendererManager();
        }

        public setRenderer(renderer: IRenderer): void {
            Sow.send('me.rnd.set', renderer, this._renderer.hnd);
        }

        //public getRendererSize(): ISize {
        //    return {
        //        width: this._renderer.renderer.element.clientWidth,
        //        height: this._renderer.renderer.element.clientHeight
        //    };
        //}

        private initObject(): void {
            this._object = new ObjectManager();
        }

        public addObject(obj: ObjectBase): void {
            Sow.send('me.obj.add', obj);
        }
    }

    export class InputManager {
        private _inputs: IInput[];

        constructor() {
            this._inputs = [];
            this.initSubs();
        }

        private initSubs(): void {
            Sow.subscribe('me.input.add', this.addInput.bind(this));
        }

        private addInput(inputProto: IInputPrototype): void {
            this._inputs.push(new inputProto());
        }
    }

    export class Keyboard implements IInput {
        public name: string;

        constructor() {
            this.name = 'keyboard';
            window.addEventListener('keydown', (ev) => this.sendInput(ev, 'keydown'), false);
            window.addEventListener('keyup', (ev) => this.sendInput(ev, 'keyup'), false);
            window.addEventListener('keypress', (ev) => this.sendInput(ev, 'keypress'), false);
        }

        private sendInput(ev: KeyboardEvent, event: string): void {
            Sow.send<IKeyboardData>('me.input.hit', {
                source: this.name,
                ev: ev,
                event: event
            });
        }
    }

    export class Mouse implements IInput {
        public name: string;

        constructor() {
            this.name = 'mouse';
            window.addEventListener('mousedown', (ev) => this.sendInput(ev, 'mousedown'), false);
            window.addEventListener('mouseup', (ev) => this.sendInput(ev, 'mouseup'), false);
            window.addEventListener('click', (ev) => this.sendInput(ev, 'click'), false);
            window.addEventListener('mousemove', (ev) => this.sendInput(ev, 'mousemove'), false);
        }

        private sendInput(ev: MouseEvent, event: string): void {
            Sow.send<IMouseData>('me.input.hit', {
                source: this.name,
                ev: ev,
                event: event
            });
        }
    }

    export class RendererManager {
        private _renderer: IRenderer;

        //public get renderer(): IRenderer { return this._renderer; }

        constructor() {
            this.initSubs();
            this.setEvents();
        }

        private initSubs(): void {
            Sow.subscribeH('me.rnd.set', this.setRenderer.bind(this), this.hnd);
        }

        private setEvents(): void {
            window.addEventListener('resize', () => Sow.send<IRendererResize>('me.rnd.rsz', {
                width: this._renderer.element.clientWidth,
                height: this._renderer.element.clientHeight
            }), false);
        }

        private setRenderer(renderer: IRenderer): void {
            if (this._renderer) {
                this._renderer.dispose();
            }
            this._renderer = renderer;
            this._renderer.addLayer();
            this.startTick();
        }

        private startTick(): void {
            this.tick();
        }

        private tick(): void {
            Sow.send('me.rnd.draw', null, this.hnd);
            this.requestAnimFrame(this.tick);
        }

        private requestAnimFrame(callBack: FrameRequestCallback) {
            var that = this;
            ((<any>window).requestAnimationFrame ||
                (<any>window).webkitRequestAnimationFrame ||
                (<any>window).mozRequestAnimationFrame ||
                (<any>window).oRequestAnimationFrame ||
                (<any>window).msRequestAnimationFrame ||
                function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                    window.setTimeout(callback, 1000 / 60);
                })((time: number) => that.tick());
        }
    }

    export class CanvasRenderer extends Sow.HandlerBase implements IRenderer {
        private _element: HTMLElement;
        private _layers: CanvasLayer[];

        //public get element(): HTMLElement { return this._element; }

        constructor() {
            super();
            this._layers = [];
            this.setEvents();
        }

        private setEvents(): void {
        }

        private attach(element: HTMLElement): void {
            this._element = element;
        }

        public addLayer(): void {
            this._layers.push(new CanvasLayer(this._element, this._layers.length));
        }

        public dispose(): void {
        }
    }

    export class CanvasLayer implements IRendererLayer {
        private _el: HTMLCanvasElement;
        private _ctx: CanvasRenderingContext2D;
        private _obj: ObjectBase[];
        private _invalided: boolean;

        constructor(
            private _parent: HTMLElement,
            private _zindex: number) {
            this._invalided = false;
            this._obj = [];
            this.initMsgs();
            this.initElement();
        }

        private initMsgs(): void {
            Sow.addMsgsType([
                { mid: 'me.layer.invalid', help: 'Called to invalidate the layer. Data: zindex' },
                { mid: 'me.layer.add', help: 'Called for add new object to the layer. Data: MetalEngine.ObjectBase' },
            ]);
            Sow.subscribe('me.layer.invalid', this.invalidate.bind(this));
            Sow.subscribe('me.layer.add', this.addObj.bind(this));
            Sow.subscribe('me.render.draw', this.draw.bind(this));
            Sow.subscribe('me.render.resize', this.resize.bind(this));
        }

        private initElement(): void {
            this._el = document.createElement('canvas');
            this._el.width = this._parent.clientWidth;
            this._el.height = this._parent.clientHeight;
            this._el.style.zIndex = this._zindex.toString();
            this._ctx = this._el.getContext('2d');
            this._parent.appendChild(this._el);
        }

        private invalidate(zindex: number): void {
            if (zindex === this._zindex) {
                this._invalided = true;
            }
        }

        private resize(): void {
            this._el.width = this._parent.clientWidth;
            this._el.height = this._parent.clientHeight;
            this._invalided = true;
        }

        private addObj(obj: ObjectBase): void {
            if (obj.layer !== this._zindex)
                return;

            this._obj.push(obj);
            Sow.sendMsgA('me.layer.invalid', obj.layer);
        }

        private draw(): void {
            if (!this._invalided)
                return;

            this._invalided = false;
            var ctx = new CanvasContext(this._el.width, this._el.height);

            for (var i = 0, o: ObjectBase; o = this._obj[i]; i++) {
                o.draw(ctx);
            }

            this._ctx.drawImage(ctx.element, 0, 0);
        }

    }

    export class CanvasContext implements IDrawContext {
        private _el: HTMLCanvasElement;
        private _c: CanvasRenderingContext2D;

        constructor(width: number, height: number) {
            this._el = window.document.createElement('canvas');
            this._el.width = width;
            this._el.height = height;
            this._c = this._el.getContext('2d');
            //this.ctx.scale(0.888, 0.888);
            //this.ctx.translate(0.5, 0.5)
        }

        public get element(): HTMLCanvasElement { return this._el; }

        public fillStyle(style: any): IDrawContext {
            this._c.fillStyle = style;
            return this;
        }

        public strokeStyle(style: any): IDrawContext {
            this._c.strokeStyle = style;
            return this;
        }

        public fillRect(x: number, y: number, w: number, h: number): IDrawContext {
            this._c.fillRect(x, y, w, h);
            return this;
        }

        public fillCircle(x: number, y: number): IDrawContext {
            var c = this._c;
            c.beginPath();
            c.arc(x, y, 50, 0, 2 * Math.PI, false);
            c.fill();
            return this;
        }

        public line(bx: number, by: number, ex: number, ey: number, w: number): IDrawContext {
            var c = this._c;
            c.beginPath();
            c.moveTo(bx, by);
            c.lineTo(ex, ey);
            c.lineWidth = w;
            c.stroke();
            return this;
        }
    }

    export class ObjectManager {
        private _objs: JS.AutoDictonary<ObjectBase>;

        constructor() {
            this._objs = new JS.AutoDictonary<ObjectBase>(JS.AutoDictonary.basicChars, 6);
            this.initMsgs();
        }

        private initMsgs(): void {
            Sow.addMsgsType([
                { mid: 'me.obj.add', help: 'Called for add new object. Data: MetalEngine.ObjectBase' },
            ]);
            Sow.subscribe('me.obj.add', this.addObj.bind(this));
        }

        private addObj(obj: ObjectBase): void {
            var oid = this._objs.autoSet(obj);
            obj.oid = oid;
            Sow.sendMsgA('me.layer.add', obj);
        }
    }

    export abstract class ObjectBase {
        private _layer: number;

        public oid: string;

        constructor() {
            this._layer = 0;
        }

        public get layer(): number { return this._layer; }
        public set layer(layer: number) {
            Sow.sendMsgA('me.layer.rem', this);
            this._layer = layer;
            Sow.sendMsgA('me.layer.add', this);
        }

        public abstract draw(ctx: IDrawContext): void;
    }

    Sow.addAddresses([
        { mid: 'me', help: 'Root of the MetalEngine' },
        { mid: 'me.engine', help: 'Root of the Engine' },
        { mid: 'me.input', help: 'Root of the Input' },
        { mid: 'me.input.add', help: 'Called for add new input source on Engine. Data: MetalEngine.IInput' },
        { mid: 'me.input.hit', help: 'Happen when input. Data: MetalEngine.IInputData' },
        { mid: 'me.rnd.set', help: 'Called for set the renderer. Data: MetalEngine.IRenderer' },
        { mid: 'me.rnd.drw', help: 'Happen when draw is called. Data: MetalEngine.' },
        { mid: 'me.rnd.rsz', help: 'Happen when draw is called. Data: MetalEngine.' },

    ]);
}