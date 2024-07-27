import { Component, Input, OnInit, AfterViewInit, ContentChildren, QueryList } from '@angular/core';
import { ButtonsComponent } from '../../button/buttons.component';
import { FiltersComponent } from '../filter/filters.component';
import { BaseComponent } from '../../base-component';
import { ApiLoader, ILoaderApi, ILoaderContent, ILoaderFilter, ILoaderOrder, ILoaderRequest, ILoaderResponse, StaticLoader } from '../../../loadercontent';
import { TableColumnComponent } from './table-column.component';
import { BaseService } from '../../../service';
import { Subscription } from 'rxjs';
//import { ITableColumn, ITableFilter } from 'app/framework';

interface IInItem {
    value: any;
    sel: boolean;
    colsTexts: string[];
}

@Component({
    selector: 's-table-collection',
    templateUrl: 'table-collection.component.html'
})
export class TableCollectionComponent extends BaseComponent implements OnInit, AfterViewInit {

    @Input() public items: any[] | ILoaderApi;
    @Input() public buttons?: ButtonsComponent;
    @Input() public filters?: FiltersComponent;
    @Input() public notinitialize?: any;
    @ContentChildren(TableColumnComponent) cols: QueryList<TableColumnComponent>;

    public inItems: IInItem[];
    public inSelAll: boolean;
    public loader: ILoaderContent;
    public inPage: number;
    public inTotalPages: number;
    public inPageLimit: number;
    public inValidFilters: boolean;
    public inOrder?: ILoaderOrder;

    private lastItemClicked: any;
    private filtersChanges?: Subscription;

    public constructor(
        private base: BaseService
    ) {
        super()
    }
    
    public ngOnInit(): void {
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
            this.checkButtonsState();
        }
        if (this.filters) {
            this.filtersChanges?.unsubscribe();
            this.filtersChanges = this.filters.onchange.subscribe(this.refresh.bind(this));
        }
        this.adjustColumns();

        if (!this.getValueFromAnyBollean(this.notinitialize)) {
            this.refresh();
        }
    }

    private setLoader(): void {
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
        try {
            const items = await this.loader.get({
                pos: this.inPage * this.inPageLimit,
                count: this.inPageLimit,
                filters: this.filterOnlyWithData(),
                order: this.inOrder,
                withTotal: true
            });
            this.setItems(items);
        }
        catch (err) {
            console.error('Table Loader Error!', err);
        }
    }

    private setItems(items: ILoaderResponse): void {
        this.inItems = this.adjustItemsDisplay(items.items);
        this.inTotalPages = Math.ceil((items.total || 1) / this.inPageLimit);
    }

    private filterOnlyWithData(): ILoaderFilter[] | undefined {
        return this.filters ?
            this.filters.filters
                .map(f => f.loader)
                .filter(l => l.value && l.value !== '') :
            undefined;
    }
    
    private adjustColumns(): void {
        for (const col of this.cols) {
            //col.order = typeof col.order != 'undefined' ? col.order : true;
            // if (!c.property) {
            //     c.property = c.name.substr(0, 1).toLowerCase() + c.name.substr(1);
            // }
        }
    }

    public refPage(page: number): void {
        this.inPage = page;
        this.refresh();
    }

    public refLimit(limit: number): void {
        this.inPageLimit = limit;
        this.refresh();
    }
    
    private setAllItemsSel(value: boolean): void {
        for (let item of this.inItems) {
            item.sel = value;
        }
    }

    public selRowClick(ev: MouseEvent, item: IInItem): void {
        this.inSelAll = false;
        const sel = item.sel ? false : true;

        if (!ev.ctrlKey) {
            this.setAllItemsSel(false);
        }

        if (ev.shiftKey && this.lastItemClicked) {
            let ini = this.inItems.indexOf(this.lastItemClicked);
            let end = this.inItems.indexOf(item);
            if (end < ini) {
                let inv = ini;
                ini = end;
                end = inv;
            }
            for (let i = ini; i <= end; i++) {
                this.inItems[i].sel = true;
            }
        }
        else {
            item.sel = sel;
        }
        this.lastItemClicked = item;
        this.checkButtonsState();
    }

    public selAllClick(): void {
        this.inSelAll = this.inSelAll ? false : true;
        this.setAllItemsSel(this.inSelAll);
        this.checkButtonsState();
    }

    public genArray(ini: number, end: number, max?: number): any[] {
        const tr: any[] = [];
        if (ini < 0) {
            end = end - ini;
            ini = 0;
        }
        if (max && end >= max) {
            ini = max - 5;
            end = max;
        }
        for (let i = ini; i < end; i++) {
            tr.push(i);
        }
        return tr;
    }

    public getSelected(): any[] | undefined {
        return this.inItems
            ?.filter(i => i.sel)
            .map(i => i.value);
    }

    private checkButtonsState(): void {
        const sels = this.getSelected()?.length || 0;
        if (this.buttons?.buttons) {
            for (const button of this.buttons.buttons) {
                switch (button.activate) {
                    case 'single':
                        button.disabled = sels == 1 ? false : true;
                        break;
                    case 'multi':
                        button.disabled = sels > 0 ? false : true;
                        break;
                }
            }
        }
    }

    private adjustItemsDisplay(items: any[]): IInItem[] {
        const inItems = <IInItem[]>[];
        for (let item of  items) {
            const inItem = <IInItem>{
                value: item,
                sel: false,
                colsTexts: <string[]>[]
            }
            inItems.push(inItem);
            for (const col of this.cols) {
                switch (col.type) {
                    case 'enum':
                        inItem.colsTexts.push(col.enum[item[col.property!]]);
                        break;
                    case 'date':
                        const value = item[col.property!];
                        if (value) {
                            const date = new Date(value);
                            inItem.colsTexts.push(date.toLocaleString());
                        }
                        else {
                            inItem.colsTexts.push('');
                        }
                        break;
                    case 'money':
                        inItem.colsTexts.push(this.base.localize.formatCurrency(item[col.property!]));
                        break;
                    case 'text':
                    default:
                        inItem.colsTexts.push(item[col.property!]);
                }
            }
        }
        return inItems;
    }

    public changeOrder(col: TableColumnComponent): void {
        if (!col.order) {
            return;
        }
        if (this.inOrder) {
            if (this.inOrder.property == col.property) {
                this.inOrder.asc = !this.inOrder.asc;
            }
            else {
                this.inOrder.property = col.property;
                this.inOrder.asc = true;
            }
        }
        else {
            this.inOrder = {
                property: col.property,
                asc: true
            }
        }
        this.refresh();
    }
}
