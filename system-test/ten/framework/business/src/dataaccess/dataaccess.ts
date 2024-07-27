import { Collection, Filter, ObjectId, UpdateFilter, Document, FindCursor, InsertOneResult, InsertManyResult, UpdateResult } from 'mongodb';
import { ConnectionResult } from './connection';
import { EntityBase } from './entity.base';

import {  FilterOperations } from 'mongodb';


export { ObjectId, FilterOperations } from 'mongodb';

export class DataAccess<T extends EntityBase> {

    protected connection!: ConnectionResult;
    protected collection!: Collection;

    public constructor(
        protected alias: string
    ) {
    }

    public async initialize(connection: ConnectionResult) {
        this.connection = connection;
    }

    protected async checkConnection() {
        if (!this.collection) {
            const client = this.connection.client;
            await client.connect();
            const db = this.connection.client.db(this.connection.cb.database);
            this.collection = await db.collection(this.alias);   
        }
    }

    public async find(filter: Filter<T>): Promise<FindCursor<T>> {
        await this.checkConnection();
        return <any>this.collection.find(<any>filter);
    }

    public async findOne(filter: Filter<T>): Promise<T | null> {
        await this.checkConnection();
        return <any>this.collection.findOne(<any>filter);
    }

    public async findOneById(id: ObjectId | string): Promise<T | null> {
        await this.checkConnection();
        const objId = typeof id == 'string' ?
            new ObjectId(id) :
            id;
        return <any>this.collection.findOne({ _id: objId });
    }

    public async insertOne(entity: T): Promise<InsertOneResult<T>> {
        await this.checkConnection();
        return this.collection.insertOne(entity);
    }

    public async insertMany(...entity: T[]): Promise<InsertManyResult<T>> {
        await this.checkConnection();
        return this.collection.insertMany(entity);
    }

    public async updateSelf(entity: T): Promise<UpdateResult | Document> {
        await this.checkConnection();
        return this.collection.replaceOne({ _id: entity._id }, entity);
    }

    public async updateOne(filter: Filter<Document>, update: UpdateFilter<T>): Promise<UpdateResult> {
        await this.checkConnection();
        return this.collection.updateOne(filter, update);
    }

    public async updateMany(filter: Filter<Document>, update: UpdateFilter<Document>): Promise<UpdateResult> {
        await this.checkConnection();
        return <any>this.collection.updateMany(filter, update);
    }
}