import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ButtonsComponent } from '../../button/buttons.component';
import { FiltersComponent } from '../filter/filters.component';
import { BaseComponent } from '../../base-component';
import { ApiLoader, ILoaderApi, ILoaderContent, ILoaderFilter, StaticLoader } from '../../../loadercontent';
import { Subscription } from 'rxjs';

@Component({
    selector: 's-li-collection',
    templateUrl: 'li-collection.component.html',
})
export class LiCollectionComponent extends BaseComponent implements OnInit, AfterViewInit {

    @Input() public items: any[] | ILoaderApi;
    @Input() public buttons?: ButtonsComponent;
    @Input() public filters?: FiltersComponent | ILoaderFilter[];
    @Input() public notinitialize?: any;
    @Input() public selectable?: any;
    @Input() public showNoItem?: any;
    @Input() public liView: TemplateRef<any>;
    @Output() public onselected: EventEmitter<any>;
    
    public inItems: any[];
    public loader: ILoaderContent;
    public inPage: number;
    public inPageLimit: number;
    public inHasMore: boolean;
    public selected: any;

    private filtersChanges?: Subscription;

    public constructor(
    ) {
        super()
        this.inItems = [];
        this.onselected = new EventEmitter<any>();
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
        if (this.filters && !Array.isArray(this.filters)) {
            this.filtersChanges?.unsubscribe();
            this.filtersChanges = this.filters.onchange.subscribe(this.refresh.bind(this));
        }
        
        if (!this.getValueFromAnyBollean(this.notinitialize)) {
            this.refresh();
        }
    }

    private prepareMeta(): void {
        this.selectable = this.getValueFromAnyBollean(this.selectable);
        this.showNoItem = this.getValueFromAnyBollean(this.showNoItem);
    }

    private setLoader(): void {
        if (!this.items) {
            throw 'LiCollection without api!';
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
        if (this.filters) {
            const loaders = Array.isArray(this.filters) ?
                this.filters :
                this.filters.getLoaders();
            return loaders
                .filter(l => l.value && l.value !== '')
        }
        return undefined;
    }

    public loadMore(): void {
        this.inPage++;
        this.getMoreItems();
    }

    public selectItem(item: any): void {
        if (this.selectable) {
            this.selected = item;
            this.onselected.emit(item);
        }
    }
}