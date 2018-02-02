import { ItemType } from './itemtype';
import { Watch } from '../core/watch';

export interface ILoader {
    tokenForController(script: string): IToken;
}

export interface ILoaderType {
    new (): ILoader;
}

export interface IToken {
    items: Item[];
    onload: Watch<{ token: IToken, item: Item }>;
    load(): void;
}

export enum ItemState {
    Initial = 0,
    Loading = 1,
    Ready = 2,
    Reloading = 3,
    Error = 4
}

export abstract class Item {

    private inState: ItemState;

    public onstate = new Watch<Item>();
    public data: any;

    public constructor(
        public url: string
    ) {
        this.inState = ItemState.Initial;
    }

    public abstract readonly type: ItemType;

    public get state(): ItemState {
        return this.inState;
    }

    public abstract update(): void;

    protected canUpdate(): boolean {
        return !(this.inState == ItemState.Loading
            || this.inState == ItemState.Reloading);
    }

    protected setUpdate(): void {
        if (this.inState == ItemState.Initial) {
            this.inState = ItemState.Loading;
        }
        if (this.inState == ItemState.Ready) {
            this.inState = ItemState.Reloading;
        }
        this.onstate.set(this);
    }

    protected setReady(): void {
        this.inState = ItemState.Ready;
        this.onstate.set(this);
    }

    protected setError(): void {
        this.inState = ItemState.Error;
        this.onstate.set(this);
    }
}