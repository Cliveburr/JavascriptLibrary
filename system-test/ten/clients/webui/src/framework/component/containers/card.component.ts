import { Component, EventEmitter, Input, Output } from "@angular/core";
import { BaseComponent } from "../base.component";

@Component({
    selector: 't-card',
    templateUrl: 'card.component.html',
    styleUrls: ['card.component.scss']
})
export class CardComponent extends BaseComponent {

    @Input() public header?: string;
    @Input() public noheader?: string;
    @Input() public collapsable?: string;
    @Output() public collapsedChange = new EventEmitter();
    @Input() public bodyClass?: string;

    public inType: number = 0;
    public inCollapsed = false;

    public ngOnInit(): void {
        const isCollapsable = this.getValueFromAnyBollean(this.collapsable);
        this.noheader = <any>this.getValueFromAnyBollean(this.noheader);
        if (isCollapsable) {
            if (this.header || this.noheader) {
                this.inType = 3;
            }
            else {
                this.inType = 2;
            }
        }
        else {
            if (this.header || this.noheader) {
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
        if (value !== this.inCollapsed) {
            this.inCollapsed = value;
            this.collapsedChange.emit(this.inCollapsed);    
        }
    }

    public toggleCollapsed(): void {
        this.inCollapsed = !this.inCollapsed;
        this.collapsedChange.emit(this.inCollapsed);
    }
}