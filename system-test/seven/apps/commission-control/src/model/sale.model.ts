import { SaleStatus } from '../entity';
import { RelationProfileModel } from '@seven/core';
import { ICollectionItem, ObjectId } from '@seven/framework';

export interface SalesModel {
}

export interface SalesCommissionModel {
    _id: string;
    value: number;
    date: Date;
    status: SaleStatus;
}

export interface SalesCommissionedModel {
    relation: RelationProfileModel;
    commissions: ICollectionItem<SalesCommissionModel>[];
}

export interface SaleFormModel {
    _id: string;
    alias: string;
    total: number;
    date: Date;
    commissioned: ICollectionItem<SalesCommissionedModel>[];
}
