import { AfterViewInit, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { ButtonsComponent } from '../button/buttons.component';
import { FiltersComponent } from './filter/filters.component';
import { BaseComponent } from '../base-component';
import { Subscription } from 'rxjs';
import { ApiLoader, ILoaderApi, ILoaderContent, ILoaderFilter, StaticLoader } from '../../loadercontent';


@Component({
    selector: 's-card-collection',
    templateUrl: 'card-collection.component.html'
})
export class CardCollectionComponent extends BaseComponent implements OnInit, AfterViewInit {

    @Input() public items: any[] | ILoaderApi;
    @Input() public buttons?: ButtonsComponent;
    @Input() public filters?: FiltersComponent;
    @Input() public notinitialize?: any;
    @Input() public size?: string;
    @Input() public cardView: TemplateRef<any>;

    public inItems: any[];
    public loader: ILoaderContent;
    public inPage: number;
    public inPageLimit: number;
    public inHasMore: boolean;

    private filtersChanges?: Subscription;
    
    public constructor(
    ) {
        super()
        this.inItems = [];
    }

    public ngOnInit(): void {
        this.prepareMeta();
        this.setLoader();
        this.setPagination();
    }

    public ngAfterViewInit(): void {
        if (this.buttons) {
            const refresh = this.buttons.buttons
                .find(b => b.isRefresh);
            if (refresh) {
                refresh.event.subscribe(this.refresh.bind(this));
            }
        }
        if (this.filters) {
            this.filtersChanges?.unsubscribe();
            this.filtersChanges = this.filters.onchange.subscribe(this.refresh.bind(this));
        }

        if (!this.getValueFromAnyBollean(this.notinitialize)) {
            this.refresh();
        }
    }

    private prepareMeta(): void {
        this.size ||= '6';
    }

    private setLoader(): void {
        if (!this.items) {
            throw 'CardCollection without api!';
        }
        if (Array.isArray(this.items)) {
            this.loader = new StaticLoader(this.items);
        }
        else {
            this.loader = new ApiLoader(this.items);
        }
    }

    private setPagination(): void {
        this.inPage = 0;
        this.inPageLimit = 5;
    }

    public async refresh(): Promise<void> {
        this.inItems = [];
        this.setPagination();
        await this.getMoreItems();
    }

    private async getMoreItems(): Promise<void> {
        const items = await this.getItems();
        this.inItems.push(...items);
        this.inHasMore = items.length == this.inPageLimit!;
    }

    protected async getItems(): Promise<any[]> {
        const response = await this.loader.get({
            pos: this.inPage * this.inPageLimit,
            count: this.inPageLimit,
            filters: this.filterOnlyWithData(),
            withTotal: false
        });
        return response.items;
    }

    private filterOnlyWithData(): ILoaderFilter[] | undefined {
        return this.filters ?
            this.filters.filters
                .map(f => f.loader)
                .filter(l => l.value && l.value !== '') :
            undefined;
    }

    public loadMore(): void {
        this.inPage++;
        this.getMoreItems();
    }
}
