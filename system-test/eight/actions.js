// https://github.com/microsoft/TypeScript/issues/36223
// https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
// node --inspect program.js

const ts = require("typescript");
const fs = require('fs');
const path = require('path');
const { spawn } = require("child_process");

console.clear();
console.log('Actions start!\n');

const args = process.argv.slice(2); 



function watchBuild(targetPath) {
    return new Promise((exe, rej) => {

        const formatHost = {
            getCanonicalFileName: path => path,
            getCurrentDirectory: ts.sys.getCurrentDirectory,
            getNewLine: () => ts.sys.newLine
        };

        function reportDiagnostic(diagnostic) {
            console.log();
            console.error("Path: " + diagnostic.file.fileName);
            console.error("Error", diagnostic.code, ":", ts.flattenDiagnosticMessageText( diagnostic.messageText, formatHost.getNewLine()));
        }

        function reportWatchStatusChanged(diagnostic) {
            // console.log(diagnostic)
            // console.info('Path: ' + targetPath, ts.formatDiagnostic(diagnostic, formatHost));
            console.info(targetPath, diagnostic.messageText);
            console.log();
        }

        const sysConfig = { ...ts.sys };
        sysConfig.writeFile = function writeFileWrapper(path, data) {
            ts.sys.writeFile(...arguments);
            if (global.reportWriteFile) {
                global.reportWriteFile(path);
            }
        }
        
        const configPath = ts.findConfigFile(targetPath, ts.sys.fileExists, 'tsconfig.json');
        if (!configPath) {
            rej(new Error("Could not find a valid 'tsconfig.json'."));
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
    });
}

async function fullBuild(targetPath) {
    return new Promise((exe, rej) => {
        
        const configPath = ts.findConfigFile(targetPath, ts.sys.fileExists,'tsconfig.json');
        if (!configPath) {
            rej(new Error("Could not find a valid 'tsconfig.json'."));
            return;
        }
        const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
        const { options, fileNames, parseErrors } = ts.parseJsonConfigFileContent(configFile.config, ts.sys, targetPath);
        if (parseErrors && parseErrors.length > 0) {
            rej(new Error(parseErrors));
            return;
        }

        const host = ts.createCompilerHost(options);

        // host.writeFile = function writeFileWrapper(path) {
        //     console.log('File: ' + path);
        //     return ts.sys.writeFile(...arguments);
        // }

        console.log('Building: ' + configPath);
        
        const program = ts.createProgram(fileNames, options, host);
        program.emit();

        exe();
    });
}

let preventWatchTwice = null;
function onWatchStaticClient(event, filename) {
    if (preventWatchTwice && preventWatchTwice.filename == filename && preventWatchTwice.time < Date.now()) {
        preventWatchTwice = null;
        return;
    }
    preventWatchTwice = {
        filename,
        time: Date.now()
    }
    if (global.reportWriteFile) {
        global.reportWriteFile(filename);
    }
}

async function watchStaticClient(targetPath) {
    fs.watch(targetPath, { recursive: true }, onWatchStaticClient);
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
    const fullPath = path.resolve(__dirname + '/bin');
    console.log('Clearing: ' + fullPath);
    if (fs.existsSync(fullPath)) {
        const command = 'rmdir /s /q ' + fullPath;
        await run(command);
    }
    console.log();
}

async function buildServer() {
    const command = 'tsc --build tsconfig.json --watch';
    const fullPath = path.resolve(__dirname + '/src/server');
    await run(command, fullPath);
}

async function install() {
    console.log('Installing...\n')
    const command = 'npm install';
    await run(command, __dirname);
}

async function buildClient() {
    const command = 'tsc --build tsconfig.json --watch';
    const fullPath = path.resolve(__dirname + '/src/client');
    await run(command, fullPath);
}

async function server() {
    console.clear();
    await clean();
    // await fullBuild('src/server');
    // await fullBuild('src/client');
    //console.log();
    watchBuild('src/server');
    watchBuild('src/client');
    watchStaticClient('src/client');
    runServer();
}

function runServer() {
    // const command = 'node --inspect boot.js';
    // const fullPath = path.resolve(__dirname + '/bin/server');
    // run(command, fullPath);
    require('./bin/server/boot');
}

async function execute() {
    for (let arg of args) {
        switch (arg) {
            case 'clean':
                await clean();
                break;
            // case 'server':
            //     await buildServer();
            //     break;
            case 'install':
                await install();
                break;
            case 'client':
                await buildClient();
                break;
            case 'build':
                await build();
                break;
            case 'server':
                await server();
                break;
        }
    }
}

execute();
