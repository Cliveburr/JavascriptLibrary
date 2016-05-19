
declare module NodeHttp.WebSocket {
    export interface IPath {
        index: number;
        create(connection: Connection): void;
    }

    export interface IPathType {
        new (): IPath;
    }

    export interface IPathItem {
        path: string;
        item: IPathType;
    }

    export interface Connection {
        ready(callBack: Function): void;
        send(index: number, method: string, ...args: any[]): void;
        createPath<T extends IPath>(path: string): T;
    }

    export var paths: Array<IPathItem>;
    export function connect(address?: string, port?: number): Connection;
}