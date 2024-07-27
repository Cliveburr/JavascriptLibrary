
// export interface InputValidatiors {
//     validator?: Function;
//     asyncValidator?: Function;
//     key: string;
//     message: string;
// }

/* remover apos alterar todo os componentes para o formato novo */
export enum ComponentStatus {
    pristine = 0,
    create = 1,
    update = 2,
    remove = 3
}

export enum ValueFormatedType {
    text = 0,
    enum = 1,
    date = 2,
    datetime = 3,
    time = 4,
    money = 5
}

export interface ValueFormated {
    type?: ValueFormatedType;
    enumType?: any;
}

/* remover apos alterar todo os componentes para o formato novo */
export interface ComponentItemBase<T> {
    status: ComponentStatus;
    value?: T;
    readonly?: boolean;
    name?: string;
    formGroup?: any;
    format?: ValueFormated;
}






// export interface IComponent<T> {
//     status?: ComponentStatus;
//     value?: T;
// }

export interface IFormated {
    format?: ValueFormated;
}