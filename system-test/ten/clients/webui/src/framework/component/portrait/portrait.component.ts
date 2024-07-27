import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';

export enum PortraitType {
    TwoLetter = 0,
    Icon = 1,
    Image = 2
}

export interface TwoLetterPortrait {
    twoLetter: string;
    borderColor: string;
    backColor: string;
    foreColor: string;
}

export interface IconPortrait {
    icon: string;
    borderColor: string;
    backColor: string;
    foreColor: string;
}

export interface PortraitModel {
    type: PortraitType;
    twoLetter?: TwoLetterPortrait;
    icon?: IconPortrait;
    image?: string;
}

@Component({
    selector: 't-portrait',
    templateUrl: 'portrait.component.html',
    styleUrls: ['portrait.component.scss']
})
export class PortraitComponent extends BaseComponent implements OnInit {
    
    public inValue!: PortraitModel;

    public ngOnInit(): void {
    }

    @Input()
    public get value(): PortraitModel | undefined {
        return this.inValue;
    };

    public set value(value: PortraitModel | undefined) {
        this.inValue = value!;
        this.adjust();
    }

    private adjust(): void {
        if (!this.inValue) {
            this.inValue = {
                type: PortraitType.TwoLetter,
                twoLetter: {
                    twoLetter: '??',
                    backColor: 'light',
                    borderColor: 'secondary',
                    foreColor: 'primary'
                }
            }
        }
        
    }

    @HostBinding('class') get hostClass(): string {
        if (this.inValue.type == PortraitType.TwoLetter) {
            return `border-${this.inValue.twoLetter?.borderColor} bg-${this.inValue.twoLetter?.backColor} twoLetter`;
        }
        else {
            return `border-${this.inValue.icon?.borderColor} bg-${this.inValue.icon?.backColor} icon`;
        }
    }
}