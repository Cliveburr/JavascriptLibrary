import path from "path";
import fs from "fs";
import { Arguments } from "./arguments";
import { BuildProject } from "./builds/build";
import { TSCBuild } from "./builds/tsc";

let rebootServerTimeout: NodeJS.Timeout | undefined;
let mainModule: string | undefined;
let serverBinRoots: string[] = [];

function bootServer() {
    try {
        require(mainModule!);
    }
    catch (err: any) {
        if (err.message && err.stack) {
            console.error(err.message);
            console.error(err.stack);
        }
        else {
            console.error('Error:', err);
        }
    }
}

function rebootServer() {
    rebootServerTimeout = undefined;

    console.log('\nRebooting server...\n');

    for (const mod in require.cache) {
        const fileMod = mod.toLocaleLowerCase();
        for (const serverBinRoot of serverBinRoots) {
            if (fileMod.startsWith(serverBinRoot)) {
                delete require.cache[mod];
                break;
            }
        }
    }

    bootServer();

    // if (global.reportClientFile) {
    //     global.reportClientFile();
    // }
}

function flagToRebootServer() {
    if (rebootServerTimeout) {
        clearTimeout(rebootServerTimeout);
    }
    rebootServerTimeout = setTimeout(rebootServer, 100);
}

function mixServerProjects(args: Arguments): BuildProject[] {
    const mixed = args.mixServerProjects();
    return Object.getOwnPropertyNames(mixed)
        .map(name => {
            const obj = <BuildProject>mixed[name];
            obj.name = name;
            const serverBinRoot = path.resolve(args.rootFolder, obj.root, 'bin');
            serverBinRoots.push(serverBinRoot.toLocaleLowerCase());
            return obj;
        })
}

function emitterReport(proj: BuildProject, isServer: boolean, file: string): void {
    if (isServer) {
        flagToRebootServer();
    }
    else {
        console.log('report: ', file)
    }
}

let preventWatchTwice: number | null = null;
function watchStaticClient(proj: BuildProject) {
    const projPath = path.resolve(global.tool.arguments.rootFolder, proj.root, 'src');
    fs.watch(projPath, { recursive: true }, (event, filename) => {
        if (preventWatchTwice && preventWatchTwice < Date.now()) {
            preventWatchTwice = null;
            return;
        }
        preventWatchTwice = Date.now();
        emitterReport(proj, false, filename);
    });
}

export async function server(args: Arguments) {
    const projs = mixServerProjects(args)

    // build all and wait to finish
    const allBuilders: Promise<void>[] = [];
    for (const proj of projs) {
        proj.builder = new TSCBuild(args, proj);
        allBuilders.push(proj.builder.serverBuild());
    }
    await Promise.all(allBuilders);

    // bind the watchs
    for (const proj of projs) {
        proj.builder.emitter.on('report', emitterReport);
        if (proj.clientWatch) {
            watchStaticClient(proj);
        }
    }

    console.log('\nBooting server...\n');

    // runs
    const runProject = projs
        .find(p => p.run);
    if (runProject) {
        mainModule = path.resolve(args.rootFolder, runProject.root, 'bin', runProject.run);
        bootServer();
        return new Promise(() => {});
    }
}