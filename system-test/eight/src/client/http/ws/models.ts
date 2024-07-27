
export const MakeJs2 = ''; //TODO: isso faz com que ele produz o .js e não da erro no index.ts export

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