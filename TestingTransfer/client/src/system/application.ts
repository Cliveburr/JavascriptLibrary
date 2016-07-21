import { app } from 'electron';
import { Window, WindowType } from '../windows/window';

export class Application {
    private _windows: Array<Window>;
    private _mainWindowType: WindowType;
    private _mainWindow: Window;

    constructor () {

    }

    public setMainWindow(window: WindowType): void {
        this._mainWindowType = window;
    }

    public get windows(): Array<Window> {
        if (this._mainWindow)
            return [this._mainWindow].concat(this._windows);
        else
            return this._windows;
    }

    public run(): void {
        app.on('ready', this.onReady.bind(this));
        app.on('window-all-closed', this.onWindowAllClosed.bind(this));
        app.on('activate', this.onActive.bind(this));
    }

    private onReady(): void {
        this.createMainWindow();
    }

    private onWindowAllClosed(): void {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    }

    private onActive(): void {
        this.createMainWindow();
    }

    private createMainWindow(): void {
        if (this._mainWindow) {
            return;
        }
        else {
            let win = new this._mainWindowType();
            win.onClosedEvent.add(this.onWindowClose.bind(this));
        }
    }

    private onWindowClose(sender: Window): void {

    }
}