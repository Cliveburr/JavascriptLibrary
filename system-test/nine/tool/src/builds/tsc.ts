import ts from "typescript";
import path from "path";
import event from "events";
import { Arguments } from "../arguments";
import { Diagnostic } from "typescript";
import { BuildProject, IBuilder } from "./build";

export class TSCBuild implements IBuilder {

    public emitter = new event.EventEmitter();
    private isCompletedExec?: Function;

    public constructor(
        private args: Arguments,
        private project: BuildProject
    ) {
    }

    public serverBuild(): Promise<void> {
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
                {
                    sourceMap: true,
                    outDir,
                },
                sysConfig,
                ts.createEmitAndSemanticDiagnosticsBuilderProgram,
                this.reportDiagnostic.bind(this),
                this.reportWatchStatusChanged.bind(this)
            );

            ts.createWatchProgram(host);
        });
    }

    private writeFileWrapper(path: string, data: string, writeByteOrderMark?: boolean): void {
        ts.sys.writeFile(path, data, writeByteOrderMark);
        if (!this.isCompletedExec && path.endsWith('.js')) {
            this.emitter.emit('report', this.project, true, path);
        }
    }

    private reportDiagnostic(diagnostic: Diagnostic): void {
        console.log();
        console.error("Path: " + diagnostic.file?.fileName);
        console.error("Error", diagnostic.code, ":", ts.flattenDiagnosticMessageText(diagnostic.messageText, ts.sys.newLine));
    }

    private reportWatchStatusChanged(diagnostic: Diagnostic): void {
        // console.info('Path: ' + targetPath, ts.formatDiagnostic(diagnostic, formatHost));
        const msg = <string>diagnostic.messageText;

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