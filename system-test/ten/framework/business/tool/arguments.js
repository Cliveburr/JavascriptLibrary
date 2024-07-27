const path = require("path");
const fs = require("fs");

class Arguments {
    
    command;
    rootFolder;
    configuration;

    constructor() {
        
        this.command = process.argv[2];
        const projectArg = process.argv[3];

        const fullProjectFile = path.resolve(__dirname, projectArg);
        if (!fs.existsSync(fullProjectFile)) {
            throw 'Project file not found: ' + projectArg;
        }
        this.rootFolder = path.dirname(fullProjectFile);
        this.configuration = require(fullProjectFile);
    }

    mixServerProjects() {
        const projs = {};
        for (const proj of Object.getOwnPropertyNames(this.configuration.projects)) {
            projs[proj] = this.mixProperties({}, this.configuration.projects[proj])
        }
        if (this.configuration.server) {
            for (const proj of Object.getOwnPropertyNames(this.configuration.server.projects)) {
                projs[proj] = this.mixProperties(projs[proj] || {}, this.configuration.server.projects[proj])
            }
        }
        return projs;
    }

    mixProperties(to, from) {
        for (const property in from) {
            to[property] = from[property];
        }
        return to;
    }
}

exports.Arguments = Arguments;