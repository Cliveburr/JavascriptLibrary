declare module Sow {
    export interface IAddress {
        mid: string;
        parent: this;
        childs: { [mid: string]: IAddress };
        handlers: { [hld: number]: Function };
        subs: Function[];
        help?: string;
    }

    export interface IAddAddress {
        mid: string;
        help?: string;
    }

    export interface IMessage {
        address: string;
        handler?: number;
        data?: any;
    }
}