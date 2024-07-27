import path from "path";
import * as fs from 'node:fs';
import { Arguments } from "./arguments";
import { process } from './process';

export async function install(args: Arguments) {
    console.log('Installing...\n');
    const command = 'npm install';
    for (const proj of Object.values(args.configuration.projects)) {
        const projPackageJson = path.resolve(args.rootFolder, proj.root, 'package.json');
        if (fs.existsSync(projPackageJson)) {
            const projPath = path.resolve(args.rootFolder, proj.root);
            await process(command, projPath);
        }
    }
}
