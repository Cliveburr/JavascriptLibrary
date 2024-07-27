import { ValueFormated } from './component.model';
import { PortraitMeta } from './portrait.model';
import { IValidators } from './validators.model';

export interface IInput {
    id?: string;
    class?: string;
    formGroup?: any;
    validators?: IValidators[];
    disabled?: boolean;
    readonly?: boolean;
    label?: string;
    prependIcon?: string;
    placeholder?: string;
    format?: ValueFormated;
}

export interface ITextInput extends IInput {
    type?: string;
}

export interface INumberInput extends IInput {
    type?: string;
    money?: boolean;
    min?: number;
    max?: number;
    precision?: number;
}

export interface IDatetimeInput extends IInput {
    todayButton?: boolean;
}

export interface ISelectOption<V> {
    value: V | undefined;
    display: string;
    default?: boolean;
}

export interface ISelectInput<V> extends IInput {
    options?: ISelectOption<V>[];
}

export interface IPortraitInput extends IInput {
    portrait: PortraitMeta;
    twoLetter?: ITextInput;
    icon?: IIconInput;
    backColor: IColorInput;
    borderColor: IColorInput;
    foreColor: IColorInput;
}

export interface IColorInput extends IInput {
}

export interface IIconInput extends IInput {
}


/* excluir depois que remover o input do core */
export interface InputData {
    value: string;
    type?: string;
    name?: string;
    placeholder?: string;
    class?: string;
    prepend?: string;
}


