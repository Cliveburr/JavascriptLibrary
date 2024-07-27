import { ILoaderFilter, ILoaderFilterType, ILoaderRequest, ILoaderRequestFilter, ILoaderResponse } from "@ten/framework_interface";
import { DataAccess } from "./dataaccess";
import { EntityBase } from "./entity.base";

export class LoaderDataAccess<T extends EntityBase> extends DataAccess<T> {

    protected applyFilter(filters: ILoaderFilter[], request: ILoaderRequest, code: number) {
        const requestFilter = request.filters
            ?.find(f => f.code == code);
        const filter = filters
            .find(f => f.code == code);
        if (filter) {
            if (requestFilter?.value) {
                switch (filter.type) {
                    case ILoaderFilterType.Regex: return this.applyRegexValueFilter(filter, requestFilter, code);
                }
            }
            return '[[remove]]';
        }
        else {
            throw 'Missing filter configuration for code: ' + code;
        }
    }

    protected applyRegexValueFilter(filter: ILoaderFilter, request: ILoaderRequestFilter, code: number) {
        if (filter.regexPattern && filter.regexFlags) {
            const regex = filter.regexPattern.replace('{{value}}', request.value);
            return {
                $regex: regex,
                $options: filter.regexFlags
            }
        }
        else {
            throw 'Missing regex filter configuration for code: ' + code;
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

    protected async loader<R>(request: ILoaderRequest, query: any[], end?: any[]): Promise<ILoaderResponse<R>> { 

        await this.checkConnection();
        this.cleanRemoves(query);
        const pipeline = query.slice();

        // if (request.order) {
        //     const sortColumn = <any>{};
        //     sortColumn[request.order.property] = request.order.asc ? 1 : -1;
        //     pipeline.push({
        //         $sort: sortColumn
        //     });
        // }

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

        const items = await this.collection.aggregate<any>(pipeline)
            .toArray();
        
        let total = <number | undefined>undefined;
        if (request.withTotal) {
            const count = query.slice();
            count.push({
                $count: 'count'
            });
            const result = await this.collection.aggregate(count);
            total = (await result.next())?.count;
        }

        return {
            items,
            total
        }
    }
}