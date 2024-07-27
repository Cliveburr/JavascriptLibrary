import { Injectable } from '@angular/core';
import { ValueFormated, ValueFormatedType } from '../model';
import { LocalizeService } from './localize.service';

@Injectable()
export class ValueFormatterService {

    public constructor(
        private localize: LocalizeService
    ) {

    }

    public format(format?: ValueFormated | string, value?: any): string | undefined {
        if (format) {
            if (typeof format == 'string') {
                switch (format) {
                    case 'money':
                        return this.getFormat({ type: ValueFormatedType.money }, value);
                    case 'date':
                        return this.getFormat({ type: ValueFormatedType.date }, value);
                    case 'time':
                        return this.getFormat({ type: ValueFormatedType.time }, value);
                    case 'datetime':
                        return this.getFormat({ type: ValueFormatedType.datetime }, value);
                }
            }
            else {
                return this.getFormat(format, value);
            }
        }
        return value;
    }

    private getFormat(format: ValueFormated, value?: any): string | undefined {
        switch (format.type) {
            case ValueFormatedType.enum:
                return format.enumType![value];
            case ValueFormatedType.date:
                if (value) {
                    const date = value instanceof Date ?
                        value :
                        new Date(value);
                    return date.toLocaleDateString();
                }
                break;
            case ValueFormatedType.money:
                return this.localize.formatCurrency(value);
        }
        return undefined;
    }
}
