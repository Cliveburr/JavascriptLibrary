import path from "path";
import { Arguments } from "./arguments";
import { process } from './process';

export async function install(args: Arguments) {
    console.log('Installing...\n');
    const command = 'npm install';
    for (const proj of Object.values(args.configuration.projects)) {
        const projPath = path.resolve(args.rootFolder, proj.root);
        await process(command, projPath);
    }
}
