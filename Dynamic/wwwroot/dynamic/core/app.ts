import { ITag, ITagType } from './itag';
import { ILoader, ILoaderType } from '../loader/iloader';
import { Root } from '../dom/virtual';

export class DynamicApp {

    public tree: Root;
    public tagProviders: ITag[];
    public loaderProvider: ILoader;

    public constructor(
    ) {
    }

    public addTagProvider(...providers: ITagType[]): void {
        this.tagProviders = providers.map(p => new p());
    }

    public addLoaderProvider(provider: ILoaderType): void {
        this.loaderProvider = new provider();
    }

    public run(root: string): void {
        this.setVirtualTree();
        this.tree.load(root);
    }

    private setVirtualTree(): void {
        let root = this.tree = new Root(this);
        root.bindToDom();
    }
}