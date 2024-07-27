import { AfterViewInit, Component, ContentChildren, Input, QueryList } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NotifyService } from "src/framework/service";
import { BaseComponent } from "../../base.component";
import { ButtonComponent } from "../../button/button.component";
import { ValueBaseComponent } from "../../value-base.component";
import { ExtendedFormGroup } from "./extend-formgroup";

@Component({
    selector: 't-validator',
    template: '<ng-content></ng-content>'
})
export class FormValidatorComponent extends BaseComponent implements AfterViewInit {
    
    //@Input() invalidMsg?: string;

    @ContentChildren(ValueBaseComponent, {descendants: true}) private controls!: QueryList<ValueBaseComponent<any>>;
    @ContentChildren(ButtonComponent, {descendants: true}) private buttons!: QueryList<ButtonComponent>;

    public group: ExtendedFormGroup;

    public constructor(
        //public notify: NotifyService
    ) {
        super()
        this.group = new ExtendedFormGroup({});
        // this.group.statusChanges.subscribe(this.onStatusChange.bind(this));
        // this.group.touchedChanges.subscribe(this.onStatusChange.bind(this));
    }

    public ngAfterViewInit(): void {
        this.setControlsInGroup();
        this.controls.changes.subscribe(this.setControlsInGroup.bind(this));
        this.setValidatorToButtons();
        this.buttons.changes.subscribe(this.setValidatorToButtons.bind(this));
    }

    private setControlsInGroup(): void {
        for (const control of this.controls) {
            this.group.addControl(control.id, control.control);
        }
    }

    private setValidatorToButtons(): void {
        for (const button of this.buttons) {
            button.setValidator(this);
        }
    }

    // public onStatusChange(): void {
    //     if (this.group.touched && this.group.dirty) {
    //         switch (this.group.status) {
    //             case 'INVALID':
    //                 if (this.invalidMsg) {
    //                     this.notify.addNotify('danger', this.invalidMsg);
    //                 }
    //                 break;
    //         }
    //     }
    // }
}