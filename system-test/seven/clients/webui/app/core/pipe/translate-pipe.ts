import { Pipe, PipeTransform, Optional, OnDestroy, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TranslateService, TranslatePathService } from '../service';

@Pipe({
    name: 'translate',
    pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
    private onTextsChange_sub: EventEmitter<void> = new EventEmitter<void>();
    private fullName: string;

    public constructor(
        private service: TranslateService,
        @Optional() private pathService: TranslatePathService,
        private _ref: ChangeDetectorRef
    ) {
        //this.onTextsChange_sub = this.service.onTextsChange.subscribe(this.onTextsChange_cb.bind(this));
    }

    public transform(obj: any, ...args: any[]): string {
        let isArray = Array.isArray(obj);
        let name = isArray ? obj[0] : obj;
        if (!name || name.length === 0) {
            return "!INVALID.NAME!";
        }

        let fullName = this.service.makeFullName(name, this.pathService.path);
        this.fullName = fullName;
        this.service.setEdit(fullName);

        let text = this.service.parse(fullName, args);
        if (isArray) {
            text = this.formatString(text, obj.slice(1))
        }

        return text;
    }

    private onTextsChange_cb(): void {
        this._ref.detectChanges();
        this._ref.markForCheck();
    }

    public ngOnDestroy(): void {
        this.service.removeEdit(this.fullName);
        this.onTextsChange_sub.unsubscribe();
    }

    private formatString(text: string, args: string[]): string {
        return typeof text == 'undefined' ?
            '' :
            text.replace(/{(\d+)}/g, (match: string, number: number) => {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match;
            });
    }
}
