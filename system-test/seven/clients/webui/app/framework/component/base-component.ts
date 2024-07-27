import { Component, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
    template: ''
})
export abstract class BaseComponent2<V, M> implements ControlValueAccessor {

    public inMeta: M;
    public onTouched: () => void;
    public onChange: (value: V) => void;

    private inValue: V;
    protected disfirnull?: boolean;

    public registerOnChange(fn: (value: V) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    @Input()
    public get value(): V {
        return this.inValue;
    };

    public set value(value: V) {
        //console.log('value', value);
        if (value !== this.inValue) {
            this.inValue = value;
            this.onValueChanged();
            if (this.onChange) {
                this.onChange(value);
            }
        }
    }

    @Input()
    public set ngModel(value: V) {
        //console.log('ngModel', value);
        if (value !== this.inValue) {
            this.inValue = value;
            this.onValueChanged();
        }
    }

    public writeValue(value: V) {
        //console.log('writeValue', value);
        if (this.disfirnull) {
            delete this.disfirnull;
            if (value === null || value === undefined) {
                return;
            }
        }
        if (value !== this.inValue) {
            this.inValue = value;
            this.onValueChanged();
        }
    }

    public onValueChanged(): void {
    }

    @Input()
    public set meta(meta: M) {
        this.inMeta = meta;
        this.onMetaChanged();
    }

    public get meta(): M {
        return this.inMeta;
    }

    protected onMetaChanged(): void {
    }
}


export abstract class BaseComponent {

    protected getValueFromAnyBollean(value?: any): boolean {
        const type = typeof value;
        return type != 'undefined' ? type == 'boolean' ? value : true : false;
    }
}