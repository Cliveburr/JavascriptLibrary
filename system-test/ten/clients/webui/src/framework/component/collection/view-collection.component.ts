import { AfterViewInit, Component, Input, OnInit, TemplateRef } from "@angular/core";
import { Subscription } from "rxjs";
import { ILoader, ILoaderRequestFilter } from "src/framework/interface.index";
import { ButtonsComponent } from "../button/buttons.component";
import { BaseCollectionComponent } from "./base-collection.component";
import { FiltersComponent } from "./filter/filters.component";

@Component({
    selector: 't-view-collection',
    templateUrl: 'view-collection.component.html'
})
export class ViewCollectionComponent extends BaseCollectionComponent implements OnInit, AfterViewInit {

    @Input() public view!: TemplateRef<any> | null;
    @Input() public buttons?: ButtonsComponent;
    @Input() public filters?: FiltersComponent;
    @Input() public notinitialize?: any;
    @Input() public singleColumn?: any;
    @Input() public loader?: ILoader<any>;

    public items: any[];
    public page: number;
    public pageLimit: number;
    public hasMore: boolean;
    public getTotal: boolean;
    public bodyClass?: string;

    private filtersChangesSub?: Subscription;
    
    public constructor(
    ) {
        super()
        this.items = [];
        this.page = 0;
        this.pageLimit = 5;
        this.hasMore = false;
        this.getTotal = false;
    }

    public ngOnInit(): void {
        if (this.getValueFromAnyBollean(this.singleColumn)) {
            this.bodyClass = 'd-flex-column gap';
        }
        else {
            this.bodyClass = 'd-flex gap';
        }
    }

    public ngAfterViewInit(): void {
        if (this.buttons?.buttons) {
            const refresh = this.buttons.buttons
                .find(b => b.isRefresh);
            if (refresh) {
                refresh.event.subscribe(this.refresh.bind(this));
            }
        }
        if (this.filters) {
            this.filtersChangesSub?.unsubscribe();
            this.filtersChangesSub = this.filters.onchange.subscribe(this.refresh.bind(this));
        }

        if (!this.getValueFromAnyBollean(this.notinitialize)) {
            this.refresh();
        }
    }

    public async refresh(): Promise<void> {
        const newItems = await this.getItems(0, this.pageLimit, this.getTotal);
        if (newItems) {
            this.page = 0;
            this.items = newItems.items;
        }
    }

    protected getItems(page: number, limit: number, withTotal: boolean) {
        if (!this.loader) {
            throw 'Missing loader!';
        }
        return this.loader({
            pos: page * limit,
            count: limit,
            filters: this.filterOnlyWithData(),
            withTotal
        });
    }

    private filterOnlyWithData(): ILoaderRequestFilter[] | undefined {
        return this.filters ?
            this.filters.filters
                .map(f => f.loader)
                .filter(l => l.value && l.value !== '') :
            undefined;
    }

    public async loadMore(): Promise<void> {
        const newItems = await this.getItems(this.page + 1, this.pageLimit, this.getTotal);
        if (newItems) {
            this.page++;
            this.items = newItems.items;
        }
    }
}