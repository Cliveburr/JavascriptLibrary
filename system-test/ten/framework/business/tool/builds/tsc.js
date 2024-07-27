const ts = require("typescript");
const path = require("path");
const events = require("events");

class TSCBuild {

    emitter = new events.EventEmitter();
    isCompletedExec;

    constructor(args, project) {
        this.args = args;
        this.project = project;
    }

    serverBuild() {
        return new Promise((exec, rej) => {
            this.isCompletedExec = exec;

            const sysConfig = { ...ts.sys };
            sysConfig.writeFile = this.writeFileWrapper.bind(this);

            const projPath = path.resolve(this.args.rootFolder, this.project.root);
            const configPath = ts.findConfigFile(projPath, ts.sys.fileExists, 'tsconfig.json');
            if (!configPath) {
                rej(new Error("Could not find a valid 'tsconfig.json'."));
                return;
            }

            const outDir = path.resolve(projPath, 'bin');

            const host = ts.createWatchCompilerHost(
                configPath,
                {},
                sysConfig,
                ts.createEmitAndSemanticDiagnosticsBuilderProgram,
                this.reportDiagnostic.bind(this),
                this.reportWatchStatusChanged.bind(this)
            );

            ts.createWatchProgram(host);
        });
    }

    writeFileWrapper(path, data, writeByteOrderMark) {
        ts.sys.writeFile(path, data, writeByteOrderMark);
        if (!this.isCompletedExec && path.endsWith('.js')) {
            this.emitter.emit('report');
        }
    }

    reportDiagnostic(diagnostic) {
        console.log();
        console.error("Path: " + diagnostic.file?.fileName);
        console.error("Error", diagnostic.code, ":", ts.flattenDiagnosticMessageText(diagnostic.messageText, ts.sys.newLine));
    }

    reportWatchStatusChanged(diagnostic) {
        // console.info('Path: ' + targetPath, ts.formatDiagnostic(diagnostic, formatHost));
        const msg = diagnostic.messageText;

        console.info(this.project.name, msg);
        console.log();

        //TODO: improve the way to watch completed build at first time
        if (this.isCompletedExec && msg.startsWith('Found 0 errors.')) {
            const holdCompletedExec = this.isCompletedExec;
            delete this.isCompletedExec;
            holdCompletedExec();
        }
    }
}

exports.TSCBuild = TSCBuild;