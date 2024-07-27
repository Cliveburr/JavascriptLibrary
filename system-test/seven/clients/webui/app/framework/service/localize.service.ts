import { Injectable } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { formatNumber } from '../helpers/mask';

export interface LocalizePreferences {
    currencyCode: string;
    currencyMask: string;
}

@Injectable()
export class LocalizeService {

    private preferences: LocalizePreferences;

    public constructor(
        private localeService: BsLocaleService
    ) {
        this.localeService.use('pt-br');

        this.preferences = {
            currencyCode: 'BRL',
            currencyMask: '#,##0.00'
        }
    }

    public formatCurrency(value: number): string {
        return 'R$ ' + formatNumber(this.preferences.currencyMask, value);
    }

    // public formatNumber(value: number): string {
    //     return formatNumber value.toString();
    // }
}
