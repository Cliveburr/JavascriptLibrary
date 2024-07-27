declare type Server = import('http').Server
import { Arguments } from '../arguments';

declare global {
    var tool: {
        arguments: Arguments
    };
}
