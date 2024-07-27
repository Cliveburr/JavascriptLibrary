const path = require("path");
const fs = require("fs");
const process = require('./process').process;

async function clean(args) {
    console.log('Clearing...\n');
    for (const proj of Object.values(args.configuration.projects)) {
        const projBinPath = path.resolve(args.rootFolder, proj.root, 'bin');
        if (fs.existsSync(projBinPath)) {
            console.log('Project: ' + projBinPath);
            const command = 'rmdir /s /q ' + projBinPath;
            await process(command);
            console.log();
        }
        const projDistPath = path.resolve(args.rootFolder, proj.root, 'dist');
        if (fs.existsSync(projDistPath)) {
            console.log('Project: ' + projDistPath);
            const command = 'rmdir /s /q ' + projDistPath;
            await process(command);
            console.log();
        }
    }
}

exports.clean = clean;