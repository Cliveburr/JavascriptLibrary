
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

let rebootServerTimeout: NodeJS.Timeout | undefined;

function rebootServer() {
    rebootServerTimeout = undefined;

    console.log('\nRebooting server...\n');

    if (global.httpServer) {
        global.httpServer.close();
    }

    for (const mod in require.cache) {
        for (const mods of global.modules) {
            if (mod.startsWith(mods.fullBinPath)) {
                delete require.cache[mod];
                break;
            }
        }
    }

    bootServer();
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

global.reportWriteFile = (path) => {
    
    path = path.replace(/\//g, '\\');

    for (const mods of global.modules) {
        if (path.startsWith(mods.fullBinPath)) {
            reportServerFile(path);
        }
    }
}

bootServer();

process.stdin.resume();