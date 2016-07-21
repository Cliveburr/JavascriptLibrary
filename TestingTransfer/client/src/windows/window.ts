import { BrowserWindow } from 'electron';
import { Event } from '../system/event';

export abstract class Window {
    private _win: Electron.BrowserWindow;

    public onClosedEvent: Event<(sender: this) => void>;

    constructor(options?: Electron.BrowserWindowOptions) {
        this._win = new BrowserWindow(options);
        this._win.setMenu(null);
        this.onClosedEvent = new Event<any>();
    }

    public show(): void {
        this._win.on('closed', this.onClosed.bind(this));
        this._win.loadURL(`file://${__dirname}/windows/main/main-window.html`);
        this._win.webContents.openDevTools();
    } 

    private onClosed(): void {
        this._win = null;
        this.onClosedEvent.raise(this);
    }
}

export interface WindowType {
    new (options?: Electron.BrowserWindowOptions): Window;
}