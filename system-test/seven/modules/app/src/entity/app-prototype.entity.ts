import { EntityBase } from '@seven/framework';

export interface AppPrototypeEntity extends EntityBase {
    name: string;
    shortName: string;
    description: string;
    usage: number;
    code: number;
}