declare module Sow {
    export interface IMessageType {
        mid: string;
        help?: string;
    }

    export interface IMessageStore {
        mid: string;
        subs: Function[];
    }

    export interface IMessage {
        mid: string;
        data?: any;
    }
}