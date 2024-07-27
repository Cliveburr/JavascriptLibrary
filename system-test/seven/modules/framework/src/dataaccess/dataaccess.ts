import { Collection, ObjectId, Db, FilterQuery, UpdateQuery } from 'mongodb';
import { EntityBase, ILoaderFilter, ILoaderFilterType, ILoaderRequest, ILoaderResponse } from '../model';

export { ObjectId, UpdateWriteOpResult, InsertWriteOpResult, InsertOneWriteOpResult } from 'mongodb';

export class DataAccess<T extends EntityBase> {

    private collection: Collection;

    public constructor(
        private alias: string
    ) {
    }

    public async initialize(db: Db): Promise<void> {
        this.collection = await db.collection(this.alias);
    }

    public insertOne(entity: T) {
        return this.collection.insertOne(entity);
    }

    public insertMany(...entity: T[]) {
        return this.collection.insertMany(entity);
    }

    public findOne(query: FilterQuery<T>): Promise<T | null> {
        return this.collection.findOne(query);
    }

    public find(query: FilterQuery<T>) {
        return this.collection.find(query);
    }

    public findOneById(id: ObjectId): Promise<T | null> {
        return this.collection.findOne({ _id: id });
    }

    public updateSelf(entity: T) {
        return this.collection.replaceOne({ _id: entity._id }, entity);
    }

    public updateOne(query: FilterQuery<T>, update: UpdateQuery<T>) {
        return this.collection.updateOne(query, update);
    }

    public updateMany(query: FilterQuery<T>, update: UpdateQuery<T>) {
        return this.collection.updateMany(query, update);
    }

    public async aggreFindOne(pipeline: object[]): Promise<T | null> {
        return await this.collection.aggregate(pipeline).hasNext() ? 
            await this.collection.aggregate(pipeline).next() :
            null;
    }

    public aggreFind<R>(pipeline: object[]) {
        return this.collection.aggregate<R>(pipeline).toArray();
    }

    public deleteOne(query: FilterQuery<T>) {
        return this.collection.deleteOne(query);
    }

    public deleteMany(query: FilterQuery<T>) {
        return this.collection.deleteMany(query);
    }    

    protected async loader<R>(request: ILoaderRequest, query: any[], end?: any[]): Promise<ILoaderResponse<R>> { 

        this.cleanRemoves(query);
        const pipeline = query.slice();

        if (request.order) {
            const sortColumn = <any>{};
            sortColumn[request.order.property] = request.order.asc ? 1 : -1;
            pipeline.push({
                $sort: sortColumn
            });
        }

        pipeline.push({
            $skip: request.pos
        });

        if (request.count > 0) {
            pipeline.push({
                $limit: request.count
            });
        }

        if (end) {
            pipeline.push(...end);
        }

        const items = await this.collection.aggregate(pipeline)
            .toArray();
        
        let total = <number | undefined>undefined;
        if (request.withTotal) {
            const count = query.slice();
            count.push({
                $count: 'count'
            });
            const result = await this.collection.aggregate(count);
            total = (await result.next()).count;
        }

        return {
            items,
            total
        }
    }

    protected applyRegexValueFilter(request: ILoaderRequest, code: string) {
        const filter = request.filters
            ?.find(f => f.code == code);
        if (filter && filter.value) {
            return {
                $regex: filter.value,
                $options: 'i'
            }
        }
        return '[[remove]]';
    }

    protected applyNotContainsObjectIdFilter(request: ILoaderRequest, code: string) {
        const filter = request.filters
            ?.find(f => f.code == code);
        if (filter && filter.value) {
            return {
                $nin: (<string[]>filter.value).map(v => new ObjectId(v))
            }
        }
        return '[[remove]]';
    }

    private makeFilter(filter: ILoaderFilter): any {
        switch (filter.type) {
            case ILoaderFilterType.Equality:
                return filter.value;
            case ILoaderFilterType.Regex:
                if (filter.regexPattern) {
                    if (filter.value) {
                        const pattern = filter.regexPattern.replace('{{value}}', filter.value);
                        return new RegExp(pattern, filter.regexFlags);
                    }
                    else {
                        return new RegExp(filter.regexPattern, filter.regexFlags);
                    }
                }
                else {
                    return new RegExp(filter.value, filter.regexFlags);
                }
            case ILoaderFilterType.ObjectId:
                return new ObjectId(filter.value);
            case ILoaderFilterType.Contains:
                if (filter.inverse) {
                    return {
                        '$nin': filter.value
                    }
                }
                else {
                    return {
                        '$in': filter.value
                    }
                }
            case ILoaderFilterType.ContainsObjectId:
                if (filter.inverse) {
                    return {
                        '$nin': (<string[]>filter.value).map(v => new ObjectId(v))
                    }
                }
                else {
                    return {
                        '$in': (<string[]>filter.value).map(v => new ObjectId(v))
                    }
                }
        }
    }

    private cleanRemoves(query: any): void {
        if (Array.isArray(query)) {
            for (const item of query) {
                this.cleanRemoves(item);
            }
        }
        else {
            switch (typeof query) {
                case 'object':
                    {
                        for (const prop in query) {
                            if (query[prop] === '[[remove]]') {
                                delete query[prop];
                            }
                            else {
                                this.cleanRemoves(query[prop]);
                            }
                        }
                    }
            }
        }
    }
}