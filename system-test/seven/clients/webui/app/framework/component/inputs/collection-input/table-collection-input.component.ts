// import { Component, OnInit, Input, HostBinding, TemplateRef } from '@angular/core';
// import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
// import { baseComponentForRoot, ComponentStatus, generateRandomName, NotifyType, TableCollectionColumn, TableCollectionData, TableCollectionItem } from '../../../model';
// import { BaseService, ValueFormatterService } from '../../../service';
// import { deepMerge } from '../../../helpers';

// enum TableStatus {
//     normal = 0,
//     editing = 1,
//     adding = 2
// }

// @Component({
//     selector: 's-table-collection-input',
//     templateUrl: 'table-collection-input.component.html',
//     styleUrls: ['table-collection-input.component.scss']
// })
// export class TableCollectionInputComponent implements OnInit {

//     @Input() public editView: TemplateRef<any>;
//     @Input() public data: TableCollectionData<any> | TableCollectionData<any>[];
//     @HostBinding('class') public hostClass: string;
    
//     public innerData: TableCollectionData<any>;
//     public innerEditingItem?: TableCollectionItem<any>;
//     public formControl: FormControl;
//     public formGroup: FormGroup;
//     public status: TableStatus;

//     public constructor(
//         private baseService: BaseService,
//         private formatterService: ValueFormatterService
//     ) {
//         this.status = 0;
//         this.innerData = <any>{};
//     }

//     public ngOnInit(): void {
//         this.buildInnerData();
//         this.setControlForm();
//     }

//     private buildInnerData(): void {
//         if (Array.isArray(this.data)) {
//             this.innerData = this.data[0];
//             const rest = this.data.slice(1);
//             deepMerge(this.innerData, ...rest);
//         }
//         else {
//             this.innerData = this.data;
//         }

//         this.innerData.value ||= [];
//         this.innerData.name ||= generateRandomName();
//         this.hostClass = 'form-group ' + this.innerData.class;
//     }

//     private setControlForm(): void {
//         this.formControl = new FormControl(this.status, [this.tableVaidator.bind(this)]);
//         this.formGroup = new FormGroup({
//             table: this.formControl
//         });
        
//         if (this.innerData.formGroup && this.innerData.name) {
//             this.innerData.formGroup.addControl(this.innerData.name, this.formGroup);
//         }
//     }

//     private checkForNewAction(): boolean {
//         if (this.status == TableStatus.adding) {
//             this.baseService.notify.addNotify(NotifyType.AlertWarning, 'Precisa concluir a adição para adcionar outro item!');
//             return true;
//         }
//         if (this.status == TableStatus.editing) {
//             this.baseService.notify.addNotify(NotifyType.AlertWarning, 'Precisa concluir a edição para adcionar outro item!');
//             return true;
//         }
//         return false;
//     }

//     public getItemsToShow(): TableCollectionItem<any>[] {
//         return (this.innerData.value || [])
//             .filter(i => i.status != ComponentStatus.remove);
//     }

//     public add_click(): void {
//         if (!this.innerData.onAddItem) {
//             return;
//         }
//         if (this.checkForNewAction()) {
//             return;
//         }
//         const newValue = this.innerData.onAddItem();
//         const formGroup = new FormGroup({});
//         this.formGroup.addControl('editingItem', formGroup);
//         baseComponentForRoot(newValue, m => m.formGroup = formGroup);
//         const newItem = <TableCollectionItem<any>>{
//             status: ComponentStatus.create,
//             value: newValue,
//             openEditor: true,
//             formGroup
//         }
//         this.innerData.value!.push(newItem);
//         this.innerEditingItem = newItem;
//         this.changeStatus(TableStatus.adding);
//         this.formControl.markAsPristine();
//         this.formControl.markAsUntouched();
//     }

//     public edit_click(item: TableCollectionItem<any>): void {
//         if (this.checkForNewAction()) {
//             return;
//         }
//         const formGroup = new FormGroup({});
//         this.formGroup.addControl('editingItem', formGroup);
//         item.formGroup = formGroup;
//         baseComponentForRoot(item.value, m => m.formGroup = formGroup);
//         item.openEditor = true;
//         this.innerEditingItem = item;
//         this.changeStatus(TableStatus.editing);
//         this.formControl.markAsPristine();
//         this.formControl.markAsUntouched();
//     }

//     public exclude_click(item: TableCollectionItem<any>): void {
//         if (this.checkForNewAction()) {
//             return;
//         }
//         if (item.status == ComponentStatus.create) {
//             const index = this.innerData.value!.indexOf(item);
//             this.innerData.value!.splice(index, 1);
//         }
//         else {
//             item.status = ComponentStatus.remove;
//         }
//     }

//     public conclude_click(): void {
//         this.innerEditingItem!.formGroup!.markAllAsTouched();
//         if (this.innerEditingItem!.formGroup!.invalid) {
//             return;
//         }
        
//         this.formGroup.removeControl('editingItem');
//         delete this.innerEditingItem!.openEditor;
//         delete this.innerEditingItem;
//         this.changeStatus(TableStatus.normal);
//     }

//     public canceladd_click(): void {
//         const index = this.innerData.value!.indexOf(this.innerEditingItem!);
//         this.innerData.value!.splice(index, 1);
//         this.formGroup.removeControl('editingItem');
//         delete this.innerEditingItem!.openEditor;
//         delete this.innerEditingItem;
//         this.changeStatus(TableStatus.normal);
//     }

//     private changeStatus(status: TableStatus): void {
//         this.status = status;
//         this.formControl.setValue(status);
//     }

//     private tableVaidator(control: AbstractControl): ValidationErrors | null {
//         if (this.status == TableStatus.normal) {
//             return null;
//         }
//         else {
//             return { tableStatus: this.status }
//         }
//     }

//     public getFormattedDisplay(col: TableCollectionColumn, item: any): string {
//         return this.formatterService.format(col, item) || '';
//     }
// }
