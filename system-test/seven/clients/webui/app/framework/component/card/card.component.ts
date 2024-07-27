import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 's-card',
    templateUrl: 'card.component.html'
})
export class CardComponent implements OnInit {
    
    @Input() public header: string;
    @Input() public collapsable: string;
    @Input() public class: string;
    @Output() public collapsedChange = new EventEmitter();

    public inType: number;
    public inCollapsed = false;

    public ngOnInit(): void {
        if (this.collapsable == 'true') {
            if (this.header) {
                this.inType = 3;
            }
            else {
                this.inType = 2;
            }
        }
        else {
            if (this.header) {
                this.inType = 1;
            }
            else {
                this.inType = 0;
            }
        }
    }

    @Input()
    public get collapsed(): boolean {
        return this.inCollapsed;
    }

    public set collapsed(value: boolean) {
        this.inCollapsed = value;
    }

    public toggleCollapsed(): void {
        this.inCollapsed = !this.inCollapsed;
        this.collapsedChange.emit(this.inCollapsed);
    }
}