const Arguments = require("./arguments").Arguments;
const install = require("./install").install;
const clean = require("./clean").clean;
const server = require("./server").server;

console.clear();
console.log('Tool initialize');

const args = new Arguments();
global.tool = {
    arguments: args
}

async function execute() {
    switch (args.command) {
        case 'install':
            await install(args);
            break;
        case 'clean':
            await clean(args);
            break;
    //     case 'build':
    //         //await build();
    //         break;
        case 'server':
            await server(args);
            break;
         default:
             throw 'Undefined command ' + args.command;
    }        
}

execute()
    .then(_ => console.log('Tool finalized!'))
    .catch(err => console.error(err));