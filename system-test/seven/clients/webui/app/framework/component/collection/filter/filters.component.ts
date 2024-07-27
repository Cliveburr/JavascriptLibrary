import { Component, ContentChildren, EventEmitter, Input, OnInit, AfterViewInit, Output, QueryList } from '@angular/core';
import { ILoaderFilter } from 'app/framework';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../base-component';
import { FilterComponent } from './filter.component';

export enum FiltersType {
    Normal = 0,
    Card = 1
}

@Component({
    selector: 's-filters',
    templateUrl: 'filters.component.html'
})
export class FiltersComponent extends BaseComponent implements OnInit, AfterViewInit {

    @Input() public card?: any;
    @Input() public title?: string;
    @Input() public direct?: ILoaderFilter[];
    @Output() public onchange: EventEmitter<FilterComponent>;
    @ContentChildren(FilterComponent) filters: QueryList<FilterComponent>;
    
    public collapsed: boolean;
    public type: FiltersType;
    private filtersChanges: Subscription[];

    public constructor() {
        super()
        this.collapsed = false;
        this.type = FiltersType.Normal;
        this.onchange = new EventEmitter<FilterComponent>();
        this.filtersChanges = [];
    }

    public ngOnInit(): void {
        this.prepareMeta();
    }

    public ngAfterViewInit(): void {
        for (const filterSub of this.filtersChanges) {
            filterSub.unsubscribe();
        }
        this.filtersChanges = [];
        for (const filter of this.filters) {
            this.filtersChanges.push(filter.onchange.subscribe(this.raiseFilter.bind(this)));
        }
    }

    private prepareMeta(): void {
        if (this.getValueFromAnyBollean(this.card)) {
            this.type = FiltersType.Card;
        }
    }

    public toggleCollapsed(): void {
        this.collapsed = !this.collapsed;
    }

    private raiseFilter(): void {
        this.onchange.emit();
    }

    public getLoaders(): ILoaderFilter[] {
        return (this.direct || [])
            .concat(this.filters
                .map(f => f.loader));
    }
}