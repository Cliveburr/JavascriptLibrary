import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICollection, ILoaderContent, ILoaderFilter } from '../../model';
import { buildLoader } from '../../helpers';
import { BaseComponent } from '../base-component';

@Component({
    template: ''
})
export abstract class BaseCollectionComponent<V, M extends ICollection> extends BaseComponent<V[], M> {

    public loader: ILoaderContent;
    public inPage: number;
    public inTotalPages: number;
    private nickName: string;

    public constructor(
        route: ActivatedRoute,
    ) {
        super()
        this.nickName = route.snapshot.params['nickName'];
    }

    public abstract refresh(): Promise<void>;

    protected setLoader(): void {
        this.loader = buildLoader(this.inMeta);
    }

    protected setPagination(): void {
        this.inPage = 0;
        this.inTotalPages = 0;
    }

    protected async getItems(): Promise<V[]> {
        const response = await this.loader.get({
            pos: this.inPage * (this.inMeta.pageLimit || 10),
            count: this.inMeta.pageLimit || 10,
            filters: this.filterOnlyWithData(),
            avoidTotal: true,
            nickName: this.nickName
        });
        this.inTotalPages = Math.ceil((response.total || 0) / (this.inMeta.pageLimit || 10));
        return response.items;
    }

    private filterOnlyWithData(): ILoaderFilter[] | undefined {
        if (this.inMeta.filter && this.inMeta.filter.filters) {
            for (let filter of this.inMeta.filter.filters) {
                if (filter.onRequest) {
                    filter.loader.value = filter.onRequest(filter.loader.value)
                }
            }
            return this.inMeta.filter.filters
                .map(f => f.loader)
                .filter(this.filterOnlyWithValue);
        }
        else {
            return undefined;
        }
    }

    private filterOnlyWithValue(loader: ILoaderFilter): boolean {
        if (loader.value) {
            if (Array.isArray(loader.value)) {
                return loader.value.length > 0;
            }
            else if (loader.value === '') {
                return false;
            }
            else{
                return true;
            }
        }
        else {
            return false;
        }
    }
}