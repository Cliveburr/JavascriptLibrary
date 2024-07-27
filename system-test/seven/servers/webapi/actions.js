const ts = require("typescript");
const fs = require('fs');
const path = require('path');
const { spawn } = require("child_process");

console.log('Actions start!\n');

const args = process.argv.slice(2); 

const modules = global.modules = [
    { name: 'webui', path: '/../../clients/webui', avoidClean: true },

    { name: 'framework', path: '/../../modules/framework', isServer: true },
    { name: 'core', path: '/../../modules/core', isServer: true },
    { name: 'app', path: '/../../modules/app', isServer: true },
    { name: 'commission-control', path: '/../../apps/commission-control', isServer: true },
    { name: 'webapi', path: '/', isServer: true },
]

let isStarted = false;
// function checkForStarted(mod) {
//     if (!isStarted) {
//         mod.isFinished = true;
//         const finishStarted = modules
//             .some(m => m.isServer && !m.isFinished);
//         if (!finishStarted) {
//             isStarted = true;
//             runServer();
//         }
//     }
// }

function watchBuild(mod) {
    return new Promise((exe, rej) => {

        const formatHost = {
            getCanonicalFileName: path => path,
            getCurrentDirectory: ts.sys.getCurrentDirectory,
            getNewLine: () => ts.sys.newLine
        };

        function reportDiagnostic(diagnostic) {
            let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
            console.log();
            console.error("Path: " + diagnostic.file.fileName);
            console.error(`Error(${line + 1},${character + 1}):`, ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine()));
        }

        function reportWatchStatusChanged(diagnostic) {
            console.info(mod.name + ': ' + diagnostic.messageText);
            console.log();
        }

        const sysConfig = { ...ts.sys };
        sysConfig.writeFile = function writeFileWrapper(path, data) {
            if (isStarted) {
                console.log(path);
            }
            ts.sys.writeFile(...arguments);
            if (isStarted && global.reportWriteFile) {
                global.reportWriteFile(path);
            }
        }
        
        const targetPath = mod.path.substr(1);
        const configPath = ts.findConfigFile(targetPath, ts.sys.fileExists, 'tsconfig.json');
        if (!configPath) {
            rej(new Error(`Could not find a valid '${targetPath}'.`));
            return;
        }

        const host = ts.createWatchCompilerHost(
            configPath,
            {},
            sysConfig,
            ts.createEmitAndSemanticDiagnosticsBuilderProgram,
            reportDiagnostic,
            reportWatchStatusChanged
        );

        //   const origCreateProgram = host.createProgram;
        //   host.createProgram = (rootNames, options, host, oldProgram) => {
        //     console.log("** We're about to create the program! **");
        //     return origCreateProgram(rootNames, options, host, oldProgram);
        //   };
        //   const origPostProgramCreate = host.afterProgramCreate;

        //   host.afterProgramCreate = program => {
        //     console.log("** We finished making the program! **");
        //     origPostProgramCreate(program);
        //   };

        ts.createWatchProgram(host);

        exe();
    });
}

let commandId = 0;
async function run(command, cwd) {
    const myId = commandId++;
    if (cwd) {
        console.log(`${myId}> ${cwd}> ${command}`);
    }
    else {
        console.log(`${myId}> ${command}`);
    }
    return new Promise((e, r) => {
        const cp = spawn(command, { cwd, shell: true, stdio: "inherit" });
        cp.on('error', r);
        cp.on('exit', e);
    });
}

async function clean() {
    const mods = modules.filter(m => !m.avoidClean);
    for (let mod of mods) {
        //const fullPath = path.resolve(__dirname + mod.path + '/bin');
        console.log('Clearing: ' + mod.fullBinPath);
        if (fs.existsSync(mod.fullBinPath)) {
            const command = 'rmdir /s /q ' + mod.fullBinPath;
            await run(command);
        }
        console.log();
    }
}

async function buildWebapi() {
    for (const mod of modules.filter(m => m.isServer)) {
        await watchBuild(mod);
    }
    isStarted = true;
    runServer();
}

async function install() {
    console.log('Installing...\n')
    for (let mod of modules) {
        const fullPath = path.resolve(__dirname + mod.path);
        const command = 'npm install';
        await run(command, fullPath);
    }
}

async function buildWebui() {
    const command = 'npm start';
    const webapi = modules.find(m => m.name == 'webui');
    const fullPath = path.resolve(__dirname + webapi.path);
    await run(command, fullPath);
}

async function build() {
    console.error('todo');
    // await clean();
    // return Promise.all([
    //     buildWebapi(),
    //     buildWebui()
    // ])
}

async function server() {
    console.clear();
    await clean();
    return Promise.all([
        buildWebapi(),
        buildWebui()
    ])
}

function runServer() {
    require('./bin/src/boot');
}

function resolvePaths() {
    for (const mod of modules.filter(m => m.isServer)) {
        const fullBinPath = path.resolve(__dirname + mod.path + '/bin');
        mod.fullBinPath = fullBinPath;
    }
}

async function execute() {
    resolvePaths();
    switch (args[0]) {
        case 'clean':
            await clean();
            break;
        case 'webapi':
            await clean();
            await buildWebapi();
            break;
        case 'install':
            await install();
            break;
        case 'webui':
            await buildWebui();
            break;
        case 'build':
            await build();
            break;
        case 'server':
            await server();
            break;
    }
}

execute();
