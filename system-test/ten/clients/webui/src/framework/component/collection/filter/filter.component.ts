import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ILoaderRequestFilter } from 'src/framework/interface.index';
import { BaseComponent } from '../../base.component';
import { FilterType, ISelectOption } from './filter.model';

@Component({
    selector: 't-filter',
    templateUrl: 'filter.component.html'
})
export class FilterComponent extends BaseComponent implements OnInit {

    @Input() public type?: FilterType;
    @Input() public code?: string;
    @Input() public placeholder?: string;
    @Input() public options?: ISelectOption<any>[];
    @Output() public onchange: EventEmitter<FilterComponent> = new EventEmitter<FilterComponent>();

    public loader: ILoaderRequestFilter;

    public constructor() {
        super()
        this.loader = {
            code: this.getCode(),
            value: ''
        }
    }

    public ngOnInit(): void {
        if (!this.code) {
            throw 'Need to set code attribute!';
        }
        this.loader.code = this.getCode();
        this.type !!= 'text';
        if (this.type == 'select' && !this.options) {
            throw 'Need set options for select type of filter!';
        }
    }

    private getCode(): number {
        return this.code ? Number.parseInt(this.code) : -1;
    }

    public raiseonchange(): void {
        this.onchange.emit(this);
    }
}
