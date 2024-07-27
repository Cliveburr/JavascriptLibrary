import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { fontAwesomeIcons } from '../../helpers';
import { ValueBaseComponent } from '../value-base.component';

export type FileType = 'dataURL';

@Component({
    selector: 't-file-input',
    templateUrl: 'file-input.component.html',
    styleUrls: ['file-input.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: FileInputComponent, multi: true }
    ]
})
export class FileInputComponent extends ValueBaseComponent<string> implements OnInit {
    
    @Input() label?: string;
    @Input() prependIcon?: string;
    @Input() type?: FileType;

    public icons: string[];
    public validateColor?: string;

    public constructor(
    ) {
        super()
        this.icons = fontAwesomeIcons;
    }

    public ngOnInit(): void {
        this.type ||= 'dataURL';
        this.initValidator(null, false, []);
    }


    public inputOnChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            var reader = new FileReader();

            reader.onload = (e) => {
                this.value = <string>reader.result;
            };
        
            switch (this.type) {
                case 'dataURL':
                    reader.readAsDataURL(input.files[0]);
                    break;
            }
        }
    }
}