//import { app, BrowserWindow } from 'electron';
//const {app} = electron;
//const {BrowserWindow} = electron;
import { Application } from './system/application';
//import { MainWindow } from './windows/main/main-window';

export class MyApp extends Application {

    protected onReady(): void {
        this.setWindow();
    }
  
}

export var program = new MyApp();





// let win: Electron.BrowserWindow;

// function createWindow() {
//   // Create the browser window.
//   win = new BrowserWindow({width: 800, height: 600});
//   win.setMenu(null);

//   // and load the index.html of the app.
//   win.loadURL(`file://${__dirname}/windows/main/main-window.html`);

//   // Open the DevTools.
//   win.webContents.openDevTools();

//   // Emitted when the window is closed.
//   win.on('closed', () => {
//     // Dereference the window object, usually you would store windows
//     // in an array if your app supports multi windows, this is the time
//     // when you should delete the corresponding element.
//     win = null;
//   });
// }

// app.on('ready', createWindow);

// // Quit when all windows are closed.
// app.on('window-all-closed', () => {
//   // On macOS it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', () => {
//   // On macOS it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (win === null) {
//     createWindow();
//   }
// });