// import { Component, OnInit, HostBinding, ViewChild, ViewEncapsulation } from '@angular/core';
// import { ISelectModalInput } from '@seven/webshared';
// import { ModalDirective } from 'ngx-bootstrap/modal';
// import { LiCollectionComponent } from '../collection/li-collection.component';
// import { BaseInputComponent } from './base-input';

// @Component({
//     selector: 's-select-modal-input',
//     templateUrl: 'select-modal-input.component.html',
//     styleUrls: ['select-modal-input.component.scss']
// })
// export class SelectModalInputComponent<V> extends BaseInputComponent<ISelectModalInput<V>, V> implements OnInit {

//     @HostBinding('class') public hostClass: string;
//     @ViewChild('modal') public modal: ModalDirective;
//     @ViewChild('collection') public collection: LiCollectionComponent<V>;
    
//     public constructor() {
//         super()
//     }

//     public ngOnInit(): void {
//         this.onDataChange();
//     }

//     protected onDataChange(): void {
//         this.buildInnerData();
//         this.customsInnerData();
//         this.setControlForm();
//     }

//     private customsInnerData(): void {
//         if (this.inData.collection) {
//             this.inData.collection.dontRefresheAtStart = true;
//             this.inData.collection.selectMode = true;
//             this.inData.collection.pageLimit ||= 15;
//         }
//         this.hostClass = 'form-group ' + this.inData.class;
//     }

//     public selectOpen(): void {
//         this.modal.show();
//         this.collection.refresh();
//     }

//     public selectItem(item: V): void {
//         this.inData.value = item;
//         this.validator.formControl.setValue(item);
//         this.modal.hide();
//     }

//     public modalHidden(): void {
//         this.validator.formControl.markAsDirty();
//     }
// }