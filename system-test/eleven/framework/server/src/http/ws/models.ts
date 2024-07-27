import * as http from 'http';
import { Host } from '../host';
import { DiagnosticLevel } from '../models';
import { Application } from '../../app';

export interface ServerData {
    host: Host,
    app: Application
}

export interface IMessage {
    path: string;
    id: number;
    method?: string;
    args?: any[];
    return?: any;
    error?: any;
}

export interface IMessageStock {
    timeSent: number;
    msg: IMessage;
    execute?: (value?: any) => void;
    reject?: (reason?: any) => void;
}

export interface ISession {
    guid: string;
    request: http.IncomingMessage;
    log: (text: any, level?: DiagnosticLevel) => void;
}

export interface IPathInstanceData {
    guid: string;
    path: string,
    session: ISession,
    call: (method: string, ...args: any[]) => Promise<any>,
    callAll: (method: string, ...args: any[]) => Promise<any>
}

export interface IPathProvider {
    getPath: (guid: string, path: string) => any,
    instancePath: (data: IPathInstanceData) => any;
    clear: (guid: string) => void;
}