
export interface IMessage {
    path: string;
    id: number;

    method?: string;
    args?: any[];
    profile?: string;
    app?: string;

    return?: any;
    error?: any;
}

export interface IMessageStock {
    timeSent: number;
    msg: IMessage;
    execute?: (value?: any) => void;
    reject?: (reason?: any) => void;
}
