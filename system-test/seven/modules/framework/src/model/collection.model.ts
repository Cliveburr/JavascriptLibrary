
export enum CollectionItemStatus {
    pristine = 0,
    create = 1,
    update = 2,
    remove = 3
}

export interface ICollectionItem<V> {
    status?: CollectionItemStatus;
    value?: V;
}