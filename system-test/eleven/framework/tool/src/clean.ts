import path from "path";
import fs from 'fs';
import { Arguments } from "./arguments";
import { process } from './process';

export async function clean(args: Arguments) {
    console.log('Clearing...\n');
    for (const proj of Object.values(args.configuration.projects)) {
        const projBinPath = path.resolve(args.rootFolder, proj.root, 'bin');
        console.log('Project: ' + projBinPath);
        if (fs.existsSync(projBinPath)) {
            const command = 'rmdir /s /q ' + projBinPath;
            await process(command);
        }
        console.log();
    }
}
