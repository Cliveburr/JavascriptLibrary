import { Arguments } from './arguments';
import { clean } from './clean';
import { install } from './install';
import { server } from './server';

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
        case 'build':
            //await build();
            break;
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
