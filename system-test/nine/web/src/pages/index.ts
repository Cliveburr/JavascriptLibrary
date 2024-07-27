import { IndexPipe } from 'tool';
import { Injectable, StaticProvider } from "providerjs";

@Injectable()
export default class Index extends IndexPipe {

    protected configurate(content: string): string {

        return content;
    }
}