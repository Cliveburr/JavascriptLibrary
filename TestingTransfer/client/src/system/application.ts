import { app, BrowserWindow } from 'electron';
import * as path from 'path';

export abstract class Application {
    private _win: Electron.BrowserWindow;
    private _options: Electron.BrowserWindowOptions;

    constructor () {
        app.on('ready', this.onReady.bind(this));
        app.on('window-all-closed', this.onWindowAllClosed.bind(this));
        app.on('activate', this.onWindowActive.bind(this));
    }

    public get window(): Electron.BrowserWindow {
        return this._win;
    }

    protected abstract onReady(): void;

    private onWindowAllClosed(): void {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    }

    public setWindow(options?: Electron.BrowserWindowOptions): void {
        if (this._win) {

        }
        else {
            this._options = options;
            this._win = new BrowserWindow(options);
            this._win.setMenu(null);
            this._win.on('closed', this.onWindowClose.bind(this));
            this._win.webContents.openDevTools();
            let p = path.resolve(__dirname, '../index.html');
            this._win.loadURL(p);
        }
    }

    private onWindowActive(): void {
        this.setWindow();
        this.onActive();
    }

    protected onActive(): void {
    }

    private onWindowClose(sender: Window): void {
        this._win = null;
        this.onClosed();
    }

    protected onClosed(): void {
    }
}