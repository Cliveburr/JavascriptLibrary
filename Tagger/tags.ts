import { Tagger, Tag } from './tagger';

export function register(tg: Tagger): void {
    tg.tagProvider
        .register(Controller);
}

export class Controller extends Tag {
    public static name = 'tg-ctr';
}