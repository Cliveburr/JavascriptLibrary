// import { FormGroup } from '@angular/forms';
// import { deepMerge } from '../../helpers/deepMerge';
// import { baseComponentForRoot } from '@seven/webshared'; 

// export class MetaValidator<M> {

//     public meta: M;
//     public formGroup: FormGroup;

//     public constructor(
//         ...metas: M[]
//     ) {
//         if (metas.length == 0) {
//             this.meta = <any>{};
//         }
//         else if (metas.length == 1) {
//             this.meta = metas[0] || <any>{};
//         }
//         else {
//             this.meta = metas[0] || <any>{};
//             const rest = metas.slice(1);
//             deepMerge(this.meta, ...rest);
//         }
//         this.formGroup = new FormGroup({});
//         baseComponentForRoot(this.meta, m => m.formGroup = this.formGroup);
//     }

//     public markAndCheckIsInvalid(): boolean {
//         this.formGroup.markAllAsTouched();
//         return this.formGroup.invalid;
//     }
// }