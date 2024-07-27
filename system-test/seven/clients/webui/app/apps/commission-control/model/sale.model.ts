import { RelationProfileModel } from '../../../core';
import { ICollectionItem, ILoaderResponse } from '../../../framework';

export interface SalesModel {
}

export enum SaleStatus {
    Open = 0,
    Paid = 1,
    Canceled = 2
}

export interface SaleFormCommissionModel {
    _id: string;
    value: number;
    date: Date;
    status: SaleStatus;
}

export interface SaleFormCommissionedModel {
    relation: RelationProfileModel;
    commissions: ICollectionItem<SaleFormCommissionModel>[];
}

export interface SaleFormModel {
    _id: string;
    alias: string;
    total: number;
    date: Date;
    commissioned: ICollectionItem<SaleFormCommissionedModel>[];
}