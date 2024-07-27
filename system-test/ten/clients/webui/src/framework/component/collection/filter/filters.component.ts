import { Component, ContentChildren, EventEmitter, Input, OnInit, AfterViewInit, Output, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { ILoaderRequestFilter } from 'src/framework/interface.index';
import { BaseComponent } from '../../base.component';
import { FilterComponent } from './filter.component';

export enum FiltersType {
    Normal = 0,
    Card = 1
}

@Component({
    selector: 't-filters',
    templateUrl: 'filters.component.html',
    styleUrls: ['filters.component.scss']
})
export class FiltersComponent extends BaseComponent implements OnInit, AfterViewInit {

    @Input() public card?: any;
    @Input() public title?: string;
    @Input() public direct?: ILoaderRequestFilter[];
    @Output() public onchange: EventEmitter<FilterComponent>;
    @ContentChildren(FilterComponent) filters!: QueryList<FilterComponent>;
    
    public type: FiltersType;
    private filtersChanges: Subscription[];

    public constructor() {
        super()
        this.type = FiltersType.Normal;
        this.onchange = new EventEmitter<FilterComponent>();
        this.filtersChanges = [];
    }

    public ngOnInit(): void {
        if (this.getValueFromAnyBollean(this.card)) {
            this.type = FiltersType.Card;
        }
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

    private raiseFilter(): void {
        this.onchange.emit();
    }

    public getLoaders(): ILoaderRequestFilter[] {
        return (this.direct || [])
            .concat(this.filters
                .map(f => f.loader));
    }
}