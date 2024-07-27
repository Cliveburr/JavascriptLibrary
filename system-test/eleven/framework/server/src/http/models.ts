import * as http from 'http';
import { Dictionary } from '../helpers';

export enum DiagnosticLevel {
    Silence = 0,
    Error = 1,
    Normal = 2,
    Detail = 3
}

export interface IDiagnostic {
    log(text: any, level?: DiagnosticLevel): void;
}

export interface IHostData {
    port?: number;
    diagnostic?: IDiagnostic;
    diagnosticLevel?: DiagnosticLevel;
    approot?: string;
    pipes?: PipelineType[];
}

export interface IRequestContext {
    guid: string;
    processed: boolean;
    req: http.IncomingMessage;
    res: http.ServerResponse;
    serverValues: Dictionary<any>;
    values: Dictionary<any>;
    log: (text: any, level?: DiagnosticLevel) => void;
}

export interface IPipeline {
    process(ctx: IRequestContext, next: () => void): void;
}

export interface IPipelineCtr {
    instance?: (ctx: IRequestContext) => IPipeline;
    new (...args: any[]): IPipeline;
}

export interface IPipelineDelegate {
    (ctx: IRequestContext, next: () => void): void;
}

export type PipelineType = IPipeline | IPipelineCtr | IPipelineDelegate;