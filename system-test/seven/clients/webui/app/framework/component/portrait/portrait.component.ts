import { Component, Input, OnInit } from '@angular/core';
import { PortraitModel } from '../../model';
import { BaseComponent } from '../base-component';

@Component({
    selector: 's-portrait',
    templateUrl: 'portrait.component.html',
    styleUrls: ['portrait.component.scss']
})
export class PortraitComponent extends BaseComponent implements OnInit {
    
    @Input() model: PortraitModel;
    @Input() isBtn?: any;

    public ngOnInit(): void {
        this.isBtn = this.getValueFromAnyBollean(this.isBtn);
    }

}