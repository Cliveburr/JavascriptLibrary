
export interface IProject {
    root: string;
    build: string;
    run: string;
    clientWatch: string;
}

export type ProjectList = { [name: string]: IProject };

export interface IServer {
    projects: ProjectList;
}

export interface IConfiguration {
    projects: ProjectList;
    server: IServer;
}