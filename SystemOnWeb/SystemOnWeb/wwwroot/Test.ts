
module Test {

    export var engine = new MetalEngine.Engine();

    //Sow.subscribe('me.input.hit', (data: MetalEngine.IInputData) => {
    //    if (data.source == 'keyboard') {
    //        var keyData = data as MetalEngine.IKeyboardData;
    //        console.log(keyData.ev.char);
    //    }
    //});

    var start = () => {
        var renderer = new MetalEngine.CanvasRenderer();
        renderer.attach(window.document.body);
        engine.setRenderer(renderer);

        var game = new Game();
        game.spawPlayer();
    }

    Sow.subscribe('sow.complete', start);

    class Background extends MetalEngine.ObjectBase {
        private _field: IField;
        private _view: IView;

        constructor() {
            super();
            this.initMsgs();
        }

        private initMsgs(): void {
            Sow.subscribe('ga.field.set', this.setField.bind(this));
            Sow.subscribe('ga.player.position.set', this.setPlayerPosition.bind(this));
        }

        private setField(field: IField): void {
            this._field = field;
            Sow.sendMsgA('me.layer.invalid', this.layer);
        }

        private setPlayerPosition(view: IView): void {
            this._view = view;
            Sow.sendMsgA('me.layer.invalid', this.layer);
        }

        public draw(ctx: MetalEngine.IDrawContext): void {
            var f = this._field;
            var v = this._view;

            if (!f || !v)
                return;

            ctx
                .fillStyle('rgb(255, 255, 255)')
                .fillRect(0, 0, v.w, v.h);

            var rx = 0, rw = 0, ry = 0, rh = 0;

            if (v.x < f.x) {
                rx = f.x - v.x;

                ctx
                    .fillStyle('rgb(70, 0, 150)')
                    .fillRect(0, 0, rx, v.h);
            }
            else {
                rx = f.x - v.x;
            }

            if (v.x + v.w > f.w) {
                rw = v.w - ((v.x + v.w) - f.w) + 1;

                ctx
                    .fillStyle('rgb(70, 0, 150)')
                    .fillRect(rw, 0, v.w, v.h);
            }
            else {
                rw = v.w;
            }

            if (v.y < f.y) {
                ry = f.y - v.y;

                ctx
                    .fillStyle('rgb(70, 0, 150)')
                    .fillRect(0, 0, v.w, ry);
            }
            else {
                ry = f.y - v.y;
            }

            if (v.y + v.h > f.h) {
                rh = v.h - ((v.y + v.h) - f.h) + 1;

                ctx
                    .fillStyle('rgb(70, 0, 150)')
                    .fillRect(0, rh, v.w, v.h);
            }
            else {
                rh = v.h;
            }

            ctx
                .strokeStyle('rgb(180, 180, 180)');

            for (var x = rx; x < rw; x += f.g) {
                ctx.line(x, ry, x, rh, 2);
            }

            for (var y = ry; y < rh; y += f.g) {
                ctx.line(rx, y, rw, y, 2);
            }
        }
    }

    class Ball extends MetalEngine.ObjectBase {
        public x: number;
        public y: number;

        constructor() {
            super();
            this.initMsgs();
        }

        private initMsgs(): void {
        }

        public draw(ctx: MetalEngine.IDrawContext): void {
            ctx
                .fillStyle('rgb(0, 255, 0)')
                .fillCircle(this.x, this.y);
        }
    }

    class Player extends Ball {
        constructor() {
            super();
        }
    }

    interface IField {
        x: number;
        y: number;
        w: number;
        h: number;
        g: number;
    }

    interface IView {
        x: number;
        y: number;
        w: number;
        h: number;
    }

    interface IMouse {
        x: number;
        y: number;
    }

    class Game {
        private _field: IField;
        private _view: IView;
        private _mouse: IMouse;

        private _b: Background;
        private _p: Ball;

        constructor() {
            this.initMsgs();
            this.initObjects();
        }

        private initMsgs(): void {
            Sow.addMsgsType([
                { mid: 'ga.field.set', help: 'Called for set the field. Data: Game.IField' },
                { mid: 'ga.player.position.set', help: 'Called for set the view. Data: Game.IView' },
            ]);
            Sow.subscribe('me.input.hit', this.input.bind(this));
            //Sow.subscribe('me.render.set', this.setRenderer.bind(this));
        }

        private initObjects(): void {
            this._b = new Background();
            engine.addObject(this._b);

            this._field = { x: 0, y: 0, h: 2000, w: 2000, g: 35 };
            Sow.sendMsgA('ga.field.set', this._field);

            this._p = new Ball();
            this._p.x = window.document.body.clientWidth / 2;
            this._p.y = window.document.body.clientHeight / 2;
            engine.addObject(this._p);
        }

        public spawPlayer(): void {
            var f = this._field;
            var x = JS.RND(f.x + 100, f.w - 100);
            var y = JS.RND(f.y + 100, f.h - 100);
            
            this._view = { x: x, y: y, w: window.document.body.clientWidth, h: window.document.body.clientHeight };
            Sow.sendMsgA('ga.player.position.set', this._view);
        }

        private input(data: MetalEngine.IInputData): void {
            if (data.source == 'keyboard') {
                var keyData = data as MetalEngine.IKeyboardData;

                if (keyData.event == 'keydown') {
                    switch (keyData.ev.keyCode) {
                        case 65: this._view.x -= 6; break;       // A
                        case 68: this._view.x += 6; break;       // D
                        case 87: this._view.y -= 6; break;       // W  
                        case 83: this._view.y += 6; break;       // S
                    }
                    Sow.sendMsgA('ga.field.set', this._field);
                    Sow.sendMsgA('me.layer.invalid', this._b.layer);
                }
            }
            //else if (data.source == 'mouse') {
            //    var mouseData = data as MetalEngine.IMouseData;

            //    if (mouseData.event == 'mousemove') {
            //        this._mouse.x = mouseData.ev.x;
            //        this._mouse.y = mouseData.ev.y;
            //    }
            //}
        }
    }
}