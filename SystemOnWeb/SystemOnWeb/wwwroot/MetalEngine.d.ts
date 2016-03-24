declare module MetalEngine {
    export interface IInputPrototype {
        new (): IInput;
    }

    export interface IInput {
        name: string;
    }

    export interface IInputData {
        source: string;
    }

    export interface IKeyboardData extends IInputData {
        ev: KeyboardEvent;
        event: string;
    }

    export interface IRenderer {
        addLayer(): void;
        dispose(): void;
    }

    export interface IRendererLayer {
    }

    export interface IDrawContext {
        fillStyle(style: any): IDrawContext;
        fillRect(x: number, y: number, w: number, h: number): IDrawContext;
    }
}