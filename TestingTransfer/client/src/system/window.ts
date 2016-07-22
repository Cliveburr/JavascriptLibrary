// import { BrowserWindow } from 'electron';
// import { Event } from '../system/event';
// import { program } from '../program';

// export abstract class Window {
//     private _win: Electron.BrowserWindow;
//     private _state: WindowState;
//     private _opt: Electron.BrowserWindowOptions;
//     private _urlPath: string;

//     public onClosedEvent: Event<(sender: this) => void>;

//     constructor(urlPath: string, options?: Electron.BrowserWindowOptions) {
//         this._opt = options;
//         this._urlPath = urlPath;
//         this._state = WindowState.Closed;
//         this.onClosedEvent = new Event<any>();
//         program.setWindow(this);
//     }

//     public get state(): WindowState {
//         return this._state;
//     }

//     public show(): void {
//         this._win = new BrowserWindow(this._opt);
//         this._win.setMenu(null);
//         this._win.on('closed', this.onClosed.bind(this));
//         this._win.webContents.openDevTools();
//         //this._state = WindowState.Opened;
//         this._win.loadURL(this._urlPath);
//         // document.onreadystatechange = () => {
//         //     if (document.readyState == "complete") {
//                  //this.onShow();
//         //     }
//         // }
//     } 

//     private onClosed(): void {
//         if (this._state == WindowState.Closed)
//             return;

//         this._win = null;
//         this._state = WindowState.Closed;
//         this.onClosedEvent.raise(this);
//     }

//     //protected onShow(): void {
//     //}
// }

// export enum WindowState {
//     Closed = 0,
//     Opened = 1
// }

// export interface WindowType {
//     new (options?: Electron.BrowserWindowOptions): Window;
// }

// export interface WindowOptions extends Electron.BrowserWindowOptions {
// }