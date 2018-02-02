import { Watch } from '../core/watch';
export var ItemState;
(function (ItemState) {
    ItemState[ItemState["Initial"] = 0] = "Initial";
    ItemState[ItemState["Loading"] = 1] = "Loading";
    ItemState[ItemState["Ready"] = 2] = "Ready";
    ItemState[ItemState["Reloading"] = 3] = "Reloading";
    ItemState[ItemState["Error"] = 4] = "Error";
})(ItemState || (ItemState = {}));
export class Item {
    constructor(url) {
        this.url = url;
        this.onstate = new Watch();
        this.inState = ItemState.Initial;
    }
    get state() {
        return this.inState;
    }
    canUpdate() {
        return !(this.inState == ItemState.Loading
            || this.inState == ItemState.Reloading);
    }
    setUpdate() {
        if (this.inState == ItemState.Initial) {
            this.inState = ItemState.Loading;
        }
        if (this.inState == ItemState.Ready) {
            this.inState = ItemState.Reloading;
        }
        this.onstate.set(this);
    }
    setReady() {
        this.inState = ItemState.Ready;
        this.onstate.set(this);
    }
    setError() {
        this.inState = ItemState.Error;
        this.onstate.set(this);
    }
}
//# sourceMappingURL=iloader.js.map