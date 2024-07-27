import { AfterViewInit, Component, ContentChildren, OnInit, QueryList, forwardRef, AfterContentInit, Output, EventEmitter } from "@angular/core";
import { BaseComponent } from '../base.component';
import { TabBodyDirective } from "./tab-body.directive";

@Component({
    selector: 't-tab',
    templateUrl: 'tab.component.html',
    styleUrls: ['tab.component.scss']
})
export class TabComponent extends BaseComponent implements AfterContentInit {
    
    @ContentChildren(TabBodyDirective) tabs!: QueryList<TabBodyDirective>;
    @Output() onSelected = new EventEmitter<{ index: number, tab: TabBodyDirective }>();

    public ngAfterContentInit(): void {
        const toActive = this.tabs
            .find(t => t.active) ||
            this.tabs.first;
        if (toActive) {
            this.setActive(toActive);
        }
    }

    public setActive(tab: TabBodyDirective): void {
        this.tabs.forEach(t => t.active = t === tab);
        const index = this.tabs.toArray().indexOf(tab);
        this.onSelected.next({
            index,
            tab
        });
    }

    public setActiveByIndex(index: number): void {
        const tab = this.tabs.get(index);
        if (tab) {
            this.tabs.forEach(t => t.active = t === tab);
            this.onSelected.next({
                index,
                tab
            });
        }
    }
}
