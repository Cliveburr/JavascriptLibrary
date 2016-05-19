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

    export interface IMouseData extends IInputData {
        ev: MouseEvent;
        event: string;
    }

    export interface IRenderer {
        addLayer(): void;
        dispose(): void;
        //element: HTMLElement
    }

    export interface IRendererResize {
        width: number;
        height: number;
    }

    export interface IRendererLayer {
    }

    export interface IDrawContext {
        fillStyle(style: any): IDrawContext;
        strokeStyle(style: any): IDrawContext;
        fillRect(x: number, y: number, w: number, h: number): IDrawContext;
        fillCircle(x: number, y: number): IDrawContext;
        line(bx: number, by: number, ex: number, ey: number, w: number): IDrawContext;
    }

    export interface IPoint {
        x: number;
        y: number;
    }

    export interface ISize {
        width: number;
        height: number;
    }

    export interface IRectangle {
        x: number;
        y: number;
        width: number;
        height: number;
    }
}