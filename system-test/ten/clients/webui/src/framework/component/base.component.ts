import { Component } from "@angular/core";
import { GlobalId } from "../helpers";

@Component({
    template: ''
})
export abstract class BaseComponent {
    
    public id: string;

    public constructor() {
        this.id = GlobalId.generateNewId();
    }

    public getValueFromAnyBollean(value?: any): boolean {
        const type = typeof value;
        return type != 'undefined' ? type == 'boolean' ? value : true : false;
    }

    public hasValueFromAny(value?: any): boolean {
        return typeof value != 'undefined';
    }
}