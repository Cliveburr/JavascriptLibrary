import { Component, OnInit, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TabComponent } from 'src/framework';
import { PortraitModel, PortraitType } from '../../portrait/portrait.component';
import { TabBodyDirective } from '../../tab/tab-body.directive';
import { ValueBaseComponent } from '../../value-base.component';

@Component({
    selector: 't-portrait-input',
    templateUrl: 'portrait-input.component.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: PortraitInputComponent, multi: true }
    ]
})
export class PortraitInputComponent extends ValueBaseComponent<PortraitModel> implements OnInit {
    
    @ViewChild('tab') tab!: TabComponent;
    
    public constructor() {
        super();
    }

    public ngOnInit(): void {
        this.initValidator(null, false, [])
        this.control.registerOnChange(this.onValueChange.bind(this));
    }

    public onValueChange(): void {
        if (this.value) {
            this.tab.setActiveByIndex(this.value.type);
        }
    }

    public tab_selected(event: { index: number, tab: TabBodyDirective }): void {
        if (!this.value) {
            return;
        }
        switch (event.index) {
            case 0: {
                this.value.type = PortraitType.TwoLetter;
                this.value.twoLetter ||= <any>{};
                break;
            }
            case 1: {
                this.value.type = PortraitType.Icon;
                this.value.icon ||= {
                    icon: 'user',
                    backColor: '',
                    borderColor: '',
                    foreColor: ''
                };
                break;
            }
            case 2: {
                this.value.type = PortraitType.Image;
                this.value.image ||= '#';
                break;
            }
        }
    }
}