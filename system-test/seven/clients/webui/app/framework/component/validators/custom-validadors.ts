import { AbstractControl, ValidationErrors } from '@angular/forms';
import { CollectionItemStatus, ICollectionItem } from '../../model';

export function requiredAny(control: AbstractControl): ValidationErrors | null {
    if (control.value && Array.isArray(control.value) && control.value.length > 0) {
        return null;
    }
    else {
        return { requiredAny: 'requiredAny' }
    }
}

export function collectionRequiredAny(control: AbstractControl): ValidationErrors | null {
    if (control.value && Array.isArray(control.value) && control.value.length > 0) {
        const list = <ICollectionItem<any>[]>control.value;
        const any = list
            .some(i => i.status != CollectionItemStatus.remove)
        if (any) {
            return null;
        }
    }
    return { collectionRequiredAny: 'collectionRequiredAny' }
}