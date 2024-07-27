
export type IValidators = string | IValidatorsFunc;

export interface IValidatorsFunc {
    validator?: Function;
    asyncValidator?: Function;
    key: string;
    message?: string;
}