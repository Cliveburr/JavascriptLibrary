import { ILoaderContent, ILoaderResponse, ILoaderRequest, ILoaderFilter, ILoaderApplyFilter,
    ILoaderFilterType } from "./loadercontent.model";
import { EqualityApplyFilter, RegexApplyFilter, ContainsApplyFilter } from './static.filter';

export class StaticLoader implements ILoaderContent {

    public constructor(
        private items?: any[]
    ) {
    }

    public async get(request: ILoaderRequest): Promise<ILoaderResponse> {

        const posIni = request.pos;
        const posEnd = request.pos + request.count - 1;

        const items = this.filterItems(request.filters);
        if (items && items.length > 0) {
            if (posEnd < items.length) {
                return {
                    items: items.slice(posIni, posEnd + 1),
                    total: items.length
                }
            }
            else if (posIni < items.length && posEnd >= items.length) {
                return {
                    items: items.slice(posIni, items.length),
                    total: items.length
                }
            }
        }

        return {
            items: [],
            total: 0
        }
    }

    private filterItems(filters?: ILoaderFilter[]): any[] | undefined {
        if (filters && filters.length > 0) {
            const applyFilter = this.prepareFilters(filters);
            return (this.items || [])
                .filter(this.applyFilters.bind(this, applyFilter));
        }
        else {
            return this.items;
        }
    }

    private prepareFilters(filters: ILoaderFilter[]): ILoaderApplyFilter[] {
        return filters.map(f => {
            switch (f.type) {
                case ILoaderFilterType.Regex:
                    return new RegexApplyFilter(f);
                case ILoaderFilterType.Contains:
                    return new ContainsApplyFilter(f);
                case ILoaderFilterType.Equality:
                default:
                    return new EqualityApplyFilter(f);
            }
        });
    }

    private applyFilters(filters: ILoaderApplyFilter[], item: any): boolean {
        for (let filter of filters) {
            if (!filter.apply(item)) {
                return false;
            }
        }
        return true;
    }
}