import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../base-component';

export type TableColumnType = 'text' | 'enum' | 'date' | 'money';

@Component({
    selector: 's-table-column',
    templateUrl: 'table-column.component.html'
})
export class TableColumnComponent extends BaseComponent implements OnInit {
    
    @Input() public property: string;
    @Input() public header: string;
    @Input() public enum?: any;
    @Input() public order?: any;
    
    public type: TableColumnType;

    public constructor() {
        super()
        this.type = 'text';
    }

    public ngOnInit(): void {
        this.order = this.getValueFromAnyBollean(this.order);
        if (this.enum) {
            this.type = 'enum';
        }
    }
}