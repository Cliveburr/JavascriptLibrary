import * as fs from 'fs';
import * as path from 'path';
import * as mod from 'module';

const appRoot = __dirname;
const _require = mod.prototype.require;
const onwatch: { [modulePath: string]: fs.FSWatcher } = {};
let preventWatchTwice: {
    module: string,
    time: number
} | null = null;

function bootServer() {
    try {
        require('./main/main.js');
    } catch (err) {
        if (err.message && err.stack) {
            console.error(err.message);
            console.error(err.stack);
        }
        else {
            console.error('Error:', err);
        }
    }
}

// function onWatchFile(modulePath: string, event: string): void {
//     if (preventWatchTwice && preventWatchTwice.module == modulePath && preventWatchTwice.time < Date.now()) {
//         preventWatchTwice = null;
//         return;
//     }
//     preventWatchTwice = {
//         module: modulePath,
//         time: Date.now() + 100
//     }
//     //console.clear();
//     if (event == 'rename') {
//         onwatch[modulePath]!.close();
//         delete onwatch[modulePath];
//     }
//     for (const mod in onwatch) {
//         delete require.cache[mod];
//     }
//     appStart();
// }

// mod.prototype.require = <any>function (this: any, id: string): any {
//     const modulePath =  (<any>mod)._resolveFilename(id, this);
//     if (modulePath.startsWith(appRoot) && !onwatch[modulePath]) {
//         onwatch[modulePath] = fs.watch(modulePath, onWatchFile.bind(onWatchFile, modulePath));
//     }
//     return _require.call(this, id);
// }


// fs.watch(__dirname, { recursive: true }, (event: string, filename: string): void => {
//    console.log('watch', event, filename);
// });

const serverBinRoot = __dirname;
const clientBinRoot = path.resolve(__dirname + '/../client');
let rebootServerTimeout: NodeJS.Timeout | undefined;

function rebootServer() {
    rebootServerTimeout = undefined;

    console.log('\nRebooting server...\n');

    for (const mod in require.cache) {
        if (mod.startsWith(serverBinRoot)) {
            delete require.cache[mod];
        }
    }

    bootServer();

    if (global.reportClientFile) {
        global.reportClientFile();
    }
}

function flagToRebootServer() {
    if (rebootServerTimeout) {
        clearTimeout(rebootServerTimeout);
    }
    rebootServerTimeout = setTimeout(rebootServer, 100);
}

function reportServerFile(path: string) {
    if (!path.endsWith('.js') || path.endsWith('boot.js')) {
        return;
    }
    flagToRebootServer();
}

function prepareToReportClientFile(path: string): string {
    const stripStart = path.replace(clientBinRoot, '');
    return stripStart.replace(/\\/g, '/');
}

global.reportWriteFile = (path) => {
    
    path = path.replace(/\//g, '\\');

    if (path.startsWith(serverBinRoot)) {
        reportServerFile(path);
    }
    else if (path.startsWith(clientBinRoot)) {
        if (global.reportClientFile) {
            global.reportClientFile(prepareToReportClientFile(path));
        }
    }
    else if (path.endsWith('.html')) {
        if (global.reportClientFile) {
            global.reportClientFile(path.replace(/\\/g, '/'));
        }
    }
}

bootServer();

process.stdin.resume();