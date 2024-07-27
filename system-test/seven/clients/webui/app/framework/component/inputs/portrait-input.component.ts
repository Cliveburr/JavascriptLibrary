import { Component, HostBinding, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PortraitModel, IPortraitInput, TwoLetterPortrait, PortraitType, IconPortrait } from '../../model';
import { GlobalId } from '../../helpers';
import { BaseInputComponent } from './base-input';

@Component({
    selector: 's-portrait-input',
    templateUrl: 'portrait-input.component.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: PortraitInputComponent, multi: true }
    ]
})
export class PortraitInputComponent extends BaseInputComponent<PortraitModel, IPortraitInput> implements OnInit {
    
    @HostBinding('class') public hostClass: string;
    
    public twoLetter: TwoLetterPortrait;
    public icon: IconPortrait;
    public tabActive: number;

    public constructor() {
        super();
        this.disfirnull = true;
    }

    public ngOnInit(): void {
        this.prepareMeta();
    }

    protected prepareMeta(): void {
        this.meta.id ||= GlobalId.generateNewId();
        this.hostClass = 'row ' + this.meta.class;

        this.meta.portrait ||= {};
        this.meta.icon ||= {};

        this.meta.twoLetter ||= {};
        this.meta.twoLetter.class = 'col-12';
        this.meta.twoLetter.label = 'Duas letras para o retrato:';

        this.meta.backColor ||= {};
        this.meta.backColor.class = 'col-12';
        this.meta.backColor.label = 'Cor de fundo:';

        this.meta.foreColor ||= {};
        this.meta.foreColor.class = 'col-12';
        this.meta.foreColor.label = 'Cor do texto:';

        this.meta.borderColor ||= {};
        this.meta.borderColor.class = 'col-12';
        this.meta.borderColor.label = 'Cor da borda:';

        this.meta.icon ||= {};
        this.meta.icon.class = 'col-12';
        this.meta.icon.label = 'Icone para o retrato:';

        switch (this.value.type) {
            case PortraitType.TwoLetter: {
                this.twoLetter = this.value.twoLetter!;
                break;
            }
            case PortraitType.Icon: {
                this.icon = this.value.icon!;
                break;
            }
        }

        this.tabActive = this.value.type;
    }

    public tab_selected(tab: number): void {
        switch (tab) {
            case 0: {
                this.value.type = PortraitType.TwoLetter;
                this.value.twoLetter ||= <any>{};
                this.twoLetter = this.value.twoLetter!;
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
                this.icon = this.value.icon!;
                break;
            }
        }
    }
}