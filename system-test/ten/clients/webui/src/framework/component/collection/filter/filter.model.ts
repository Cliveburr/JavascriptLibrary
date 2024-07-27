
export type FilterType = 'automatic' | 'text' | 'select';

export interface ISelectOption<V> {
    value: V | undefined;
    display: string;
    default?: boolean;
}
