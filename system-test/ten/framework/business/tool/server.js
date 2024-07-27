const path = require("path");
const TSCBuild = require("./builds/tsc").TSCBuild;
const process = require("./process").process;

const typesToTSCBuild = ['api', 'library'];

const allTscRunning = [];
const serverBinRoots = [];
let rebootTimeout;

function bootProject(proj) {
    try {
        require(proj.mainModule);
    }
    catch (err) {
        if (err.message && err.stack) {
            console.error(err.message);
            console.error(err.stack);
        }
        else {
            console.error('Error:', err);
        }
    }
}

function rebootProject() {
    delete rebootTimeout;

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

    for (const proj of allTscRunning) {
        bootProject(proj);
    }
}

function flagToRebootProject() {
    if (rebootTimeout) {
        clearTimeout(rebootTimeout);
    }
    rebootTimeout = setTimeout(rebootProject.bind(rebootProject), 100);
}

function mixServerProjects(args) {
    const mixed = args.mixServerProjects();
    return Object.getOwnPropertyNames(mixed)
        .map(name => {
            const obj = mixed[name];
            obj.name = name;
            const serverBinRoot = path.resolve(args.rootFolder, obj.root, 'bin');
            serverBinRoots.push(serverBinRoot.toLocaleLowerCase());
            return obj;
        })
}

function tscRun(args, proj) {
    proj.mainModule = path.resolve(args.rootFolder, proj.root, 'bin\\main\\main.js');
    bootProject(proj);
    return new Promise(() => {});
}

function angularRun(args, proj) {
    const projRoot = path.resolve(args.rootFolder, proj.root);
    return process('npm start', projRoot);
}

const typesToRun = {
    'api': tscRun,
    'angular': angularRun
};

async function server(args) {
    const projs = mixServerProjects(args)

    // build all and wait to finish
    const tscBuildProjects = projs
        .filter(p => typesToTSCBuild.indexOf(p.type) > -1);
    const allBuilders = tscBuildProjects
        .map(p => {
            p.builder = new TSCBuild(args, p);
            return p.builder.serverBuild();
        });
    await Promise.all(allBuilders);

    // bind the watchs
    for (const proj of tscBuildProjects) {
        proj.builder.emitter.on('report', flagToRebootProject);
    }

    console.log('\nBooting server...\n');

    // runs
    const runningPromises = [];
    for (const proj of projs) {
        const typeOfProj = typesToRun[proj.type];
        if (typeOfProj) {
            runningPromises.push(typeOfProj(args, proj));
        }
        if (proj.type == 'api') {
            allTscRunning.push(proj);
        }
    }
        
    // runningProjects = projs
    //     .filter(p => typesToRun.indexOf(p.type) > -1);
    // const allRunning = runningProjects
    //     .map(p => {
    //         p.mainModule = path.resolve(args.rootFolder, p.root, 'bin\\main\\main.js');
    //         bootProject(p);
    //         return new Promise(() => {});
    //     })
    await Promise.all(runningPromises);
}

exports.server = server;