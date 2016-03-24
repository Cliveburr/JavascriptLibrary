
module MetalEngine {
    export class Engine {
        private _inputs: InputManager;
        private _renderer: RendererManager;

        constructor() {
            this.initMsgs();
            this.initInputs();
            this.initRenderer();
        }

        private initMsgs(): void {
        }

        private initInputs(): void {
            this._inputs = new InputManager();
            Sow.sendMsgA('me.input.add', Keyboard);
        }

        private initRenderer(): void {
            this._renderer = new RendererManager();
        }

        public setRenderer(renderer: IRenderer): void {
            Sow.sendMsgA('me.render.set', renderer);
        }
    }

    export class InputManager {
        private _inputs: IInput[];

        constructor() {
            this._inputs = [];
            this.initMsgs();
        }

        private initMsgs(): void {
            Sow.addMsgsType([
                { mid: 'me.input.add', help: 'Called for add new input source. Data: MetalEngine.IInput' },
                { mid: 'me.input.ev', help: 'Happen when input. Data: MetalEngine.IInputData' },
            ]);
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
            window.addEventListener('keydown', (ev) => this.keydown(ev), false);
        }

        private keydown(ev: KeyboardEvent): void {
            Sow.sendMsgA<IKeyboardData>('me.input.ev', {
                source: this.name,
                ev: ev,
                event: 'keydown'
            });
        }
    }

    export class RendererManager {
        private _renderer: IRenderer;

        constructor() {
            this.initMsgs();
        }

        private initMsgs(): void {
            Sow.addMsgsType([
                { mid: 'me.render.set', help: 'Called for set the renderer. Data: MetalEngine.IRenderer' },
                { mid: 'me.render.draw', help: 'Happen when draw is called. Data: MetalEngine.' },
            ]);
            Sow.subscribe('me.render.set', this.setRenderer.bind(this));
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
            //this._drawSceneCallBack.apply(this._scene, [this._inputState.clone()]);
            Sow.sendMsgA('me.render.draw');
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

    export class CanvasRenderer implements IRenderer {
        private _element: HTMLElement;
        private _layers: CanvasLayer[];

        constructor() {
            this._layers = [];
            this.initMsgs();
        }

        private initMsgs(): void {
            Sow.subscribe('me.render.draw', this.draw.bind(this));
        }

        private draw(): void {
            var ctx = new CanvasContext(500, 500);
            this._layers[0].draw(ctx);
        }

        public attach(element: HTMLElement): void {
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

        constructor(
            private _element: HTMLElement,
            private _zindex: number) {
            this.initElement();
        }

        private initElement(): void {
            this._el = document.createElement('canvas');
            this._el.style.zIndex = this._zindex.toString();
            this._ctx = this._el.getContext('2d');
            this._element.appendChild(this._el);
        }

        public draw(ctx: CanvasContext): void {
            this._ctx.drawImage(ctx.ctx.canvas, 0, 0);
        }
    }

    export class CanvasContext implements IDrawContext {
        public element: HTMLCanvasElement;
        public ctx: CanvasRenderingContext2D;

        constructor(width: number, height: number) {
            this.element = window.document.createElement('canvas');
            this.element.width = width;
            this.element.height = height;
            this.ctx = this.element.getContext('2d');
            //this.ctx.scale(0.888, 0.888);
            //this.ctx.translate(0.5, 0.5)

            this.ctx.fillStyle = 'rgb(0, 0, 0)';
            this.ctx.fillRect(10, 10, 100, 100);
        }

        public fillStyle(style: any): IDrawContext {
            this.ctx.fillStyle = style;
            return this;
        }

        public fillRect(x: number, y: number, w: number, h: number): IDrawContext {
            this.ctx.fillRect(x, y, w, h);
            return this;
        }
    }
}