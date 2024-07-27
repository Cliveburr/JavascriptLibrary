const path = require("path");
const process = require('./process').process;

async function install(args) {
    console.log('Installing...\n');
    const command = 'npm install';
    for (const proj of Object.values(args.configuration.projects)) {
        const projPath = path.resolve(args.rootFolder, proj.root);
        await process(command, projPath);
    }
}

exports.install = install;