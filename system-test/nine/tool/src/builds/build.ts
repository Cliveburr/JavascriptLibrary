import { EventEmitter } from "events";
import { IProject } from "../configuration";

export interface IBuilder {
    emitter: EventEmitter;
    serverBuild(): Promise<void>;
}

export interface BuildProject extends IProject {
    name: string;
    builder: IBuilder;
}