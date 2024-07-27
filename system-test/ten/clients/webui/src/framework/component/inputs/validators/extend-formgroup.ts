import { FormGroup, AsyncValidatorFn, ValidatorFn, AbstractControlOptions } from '@angular/forms';
import { Subscription, Subject, Observable, merge, distinctUntilChanged } from 'rxjs';

export class ExtendedFormGroup extends FormGroup {
    
    //public statusChanges$: Subscription;
    public touchedChanges: Subject<boolean> = new Subject<boolean>();

    public constructor(
        formState?: any,
        validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
        asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
    ) {
        super(formState, validatorOrOpts, asyncValidator);

        // this.statusChanges$ = merge(
        //     this.valueChanges$,

        //     distinctUntilChanged(this.touchedChanges, this.valueChanges$)
        // ).subscribe();
    }
    

    public override markAsTouched(opts?: { onlySelf?: boolean; }): void {
        super.markAsTouched(opts);
        this.touchedChanges.next(true);
    }
}