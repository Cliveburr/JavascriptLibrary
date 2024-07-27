// import { DataAccess, EntityBase } from './dataaccess';
// import { ILoaderRequest, ILoaderResponse, ILoaderFilter, ILoaderFilterType } from '../model/loadercontent.model';
// import { Cursor, DeleteWriteOpResultObject, FilterQuery, InsertWriteOpResult, ObjectId, UpdateWriteOpResult } from 'mongodb';
// import { constructorof, MongoBuilder, MongoBuilderQuery, NameAccess } from './builder';

// export abstract class BaseDataAccess33<T extends EntityBase> extends DataAccess {

//     private inBuilder: MongoBuilder<T>;

//     public constructor(
//         alias: string,
//         private entity: constructorof<T>
//     ) {
//         super(alias)
//     }

//     public proxy<E>(entity: constructorof<E>): E {
//         return NameAccess.getProxy(entity);
//     }
    
//     public create(...entity: T[]): Promise<InsertWriteOpResult<T>> {
//         return this.collection.insertMany(entity);
//     }

//     public updateOne(entity: T): Promise<UpdateWriteOpResult> {
//         return this.collection.replaceOne({ _id: entity._id }, entity);
//     }

//     public updateByQuery(query: FilterQuery<T>, entity: T): Promise<UpdateWriteOpResult> {
//         return this.collection.replaceOne(query, entity);
//     }

//     public async replace(...entity: T[]): Promise<UpdateWriteOpResult[]> {
//         const results: UpdateWriteOpResult[] = [];
//         for (const ent of entity) {
//             results.push(await this.collection.replaceOne({ _id: ent._id }, ent));
//         }
//         return results;
//     }

//     public delete(...entity: T[]): Promise<DeleteWriteOpResultObject> {
//         const ids = entity
//             .map(e => e._id);
//         return this.collection.deleteMany({
//             _id: {
//                 $in: ids
//             }
//         });
//     }

//     public deleteByQuery(query: FilterQuery<T>): Promise<DeleteWriteOpResultObject> {
//         return this.collection.deleteMany(query);
//     }

//     public async getById(id: ObjectId): Promise<T | null> {
//         return await this.collection.findOne({ _id: id });
//     }

//     public async find(filter: FilterQuery<T>): Promise<Cursor<T>> {
//         return await this.collection.find(filter);
//     }

//     public async findOne(filter: FilterQuery<T>): Promise<T | null> {
//         return await this.collection.findOne(filter);
//     }

//     public async queryOne(cacheName: string, builder: (b: MongoBuilderQuery<T>) => void, params?: { [key: string]: any }): Promise<T | null> {
//         const query = this.builder.query(cacheName, builder, params);
//         return await this.collection.findOne(query);
//     }

//     protected get builder(): MongoBuilder<T> {
//         if (!this.inBuilder) {
//             this.inBuilder = new MongoBuilder(this.entity);
//         }
//         return this.inBuilder;
//     }

//     protected applyFilterCode(request: ILoaderRequest, code: string, apply: ILoaderFilter): void {
//         const filter = request.filters
//             ?.find(f => f.code == code);
//         if (filter) {
//             filter.type = apply.type;
//             filter.property = apply.property;
//             filter.regexPattern = apply.regexPattern;
//             filter.regexFlags = apply.regexFlags;
//         }
//     }

//     /** 
//      * startPipeline, $match, $sort, $skip, $limit, endPipeline 
//     */
//     protected async loadContent(request: ILoaderRequest, startPipeline?: any[], endPipeline?: any[]): Promise<ILoaderResponse> { 

//         const pipeline = startPipeline || <any[]>[];
//         let query = <any>undefined;

//         if (request.filters && request.filters.length > 0) {
//             query = {};
    
//             for (let filter of request.filters) {
//                 if (filter.value && filter.property) {
//                     query[filter.property] = this.makeFilter(filter);
//                 }
//             }

//             pipeline.push({
//                 "$match": query
//             })
//         }

//         if (request.order) {
//             const sortColumn = <any>{};
//             sortColumn[request.order.property] = request.order.asc ? 1 : -1;
//             pipeline.push({"$sort": sortColumn });
//         }

//         pipeline.push({ "$skip": request.pos });
//         if (request.count > 0) {
//             pipeline.push({ "$limit": request.count });
//         }
//         if (endPipeline) {
//             pipeline.push(...endPipeline);
//         }

//         const items = await this.collection.aggregate(pipeline)
//             .toArray();
//         let total = <number | undefined>undefined;
//         if (request.withTotal) {
//             total = await this.collection.countDocuments(query, undefined);
//         }
//         return {
//             items,
//             total
//         }
//     }

//     private makeFilter(filter: ILoaderFilter): any {
//         switch (filter.type) {
//             case ILoaderFilterType.Equality:
//                 return filter.value;
//             case ILoaderFilterType.Regex:
//                 if (filter.regexPattern) {
//                     if (filter.value) {
//                         const pattern = filter.regexPattern.replace('{{value}}', filter.value);
//                         return new RegExp(pattern, filter.regexFlags);
//                     }
//                     else {
//                         return new RegExp(filter.regexPattern, filter.regexFlags);
//                     }
//                 }
//                 else {
//                     return new RegExp(filter.value, filter.regexFlags);
//                 }
//             case ILoaderFilterType.ObjectId:
//                 return new ObjectId(filter.value);
//             case ILoaderFilterType.Contains:
//                 if (filter.inverse) {
//                     return {
//                         '$nin': filter.value
//                     }
//                 }
//                 else {
//                     return {
//                         '$in': filter.value
//                     }
//                 }
//             case ILoaderFilterType.ContainsObjectId:
//                 if (filter.inverse) {
//                     return {
//                         '$nin': (<string[]>filter.value).map(v => new ObjectId(v))
//                     }
//                 }
//                 else {
//                     return {
//                         '$in': (<string[]>filter.value).map(v => new ObjectId(v))
//                     }
//                 }
//         }
//     }
// }