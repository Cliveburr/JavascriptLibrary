import { Root } from '../dom/virtual';
export class DynamicApp {
    constructor() {
    }
    addTagProvider(...providers) {
        this.tagProviders = providers.map(p => new p());
    }
    addLoaderProvider(provider) {
        this.loaderProvider = new provider();
    }
    run(root) {
        this.setVirtualTree();
        this.tree.load(root);
    }
    setVirtualTree() {
        let root = this.tree = new Root(this);
        root.bindToDom();
    }
}
//# sourceMappingURL=app.js.map