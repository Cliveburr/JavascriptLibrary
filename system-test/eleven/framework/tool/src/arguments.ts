import path from "path";
import fs from 'fs';
import { IConfiguration, ProjectList } from "./configuration";

export class Arguments {
    
    public readonly command: string | undefined;
    public readonly rootFolder: string;
    public readonly configuration: IConfiguration;

    public constructor() {
        
        this.command = process.argv[2];
        const projectArg = process.argv[3]!;

        const fullProjectFile = path.resolve(__dirname, projectArg);
        if (!fs.existsSync(fullProjectFile)) {
            throw 'Project file not found: ' + projectArg;
        }
        this.rootFolder = path.dirname(fullProjectFile);
        this.configuration = <IConfiguration>require(fullProjectFile);
    }

    public mixServerProjects() {
        const projs: ProjectList = {};
        for (const proj of Object.getOwnPropertyNames(this.configuration.projects)) {
            projs[proj] = this.mixProperties({}, this.configuration.projects[proj])
        }
        for (const proj of Object.getOwnPropertyNames(this.configuration.server.projects)) {
            projs[proj] = this.mixProperties(projs[proj] || {}, this.configuration.server.projects[proj])
        }
        return projs;
    }

    public mixProperties(to: any, from: any): any {
        for (const property in from) {
            to[property] = from[property];
        }
        return to;
    }
}