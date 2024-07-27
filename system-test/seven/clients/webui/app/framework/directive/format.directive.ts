import { Pipe, PipeTransform } from '@angular/core';
import { ComponentItemBase, IFormated } from '../model';
import { ValueFormatterService } from '../service';

@Pipe({
    name: 'sFormat'
})
export class FormatPipe implements PipeTransform {

    public constructor(
        private valueFormatterService: ValueFormatterService
    ) {
    }

    public transform(value: any, ...args: [IFormated | string, ...any]): string {

        let format: any = args && args.length > 0 ?
            args[0] :
            undefined;

        if (format && format['format']) {
            format = format['format'];
        }

        return this.valueFormatterService.format(format, value) || '';
    }
}