import { Component, Input, OnInit, HostBinding, Output, EventEmitter } from '@angular/core';
import { ILoaderFilter } from '../../../loadercontent';
import { GlobalId } from '../../../helpers';
import { ISelectOption } from 'app/framework';

export type FilterType = 'automatic' | 'text' | 'select';

@Component({
    selector: 's-filter',
    templateUrl: 'filter.component.html'
})
export class FilterComponent implements OnInit {

    @Input() public type: FilterType;
    @Input() public code: string;
    @Input() public size?: string;
    @Input() public placeholder?: string;
    @Input() public options?: ISelectOption<any>[];
    @Output() public onchange: EventEmitter<FilterComponent>;
    @HostBinding('class') public hostClass: string;

    public id: string;
    public loader: ILoaderFilter;
    private timeout?: number;

    public constructor() {
        this.onchange = new EventEmitter<FilterComponent>();
    }

    public ngOnInit(): void {
        this.id = GlobalId.generateNewId();
        this.setLoader();
        this.type !!= 'text';
        if (this.type == 'select' && !this.options) {
            throw 'Need set options for select type of filter!';
        }
        this.hostClass = `col-${(this.size || '6')}`;
    }

    private setLoader(): void {
        this.loader = {
            code: this.code,
            value: '',
            inverse: false
        }
    }

    public filterOnChange(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = <any>setTimeout(this.raiseFilter.bind(this), 300);
    }

    public raiseFilter(): void {
        this.onchange.emit(this);
    }

}