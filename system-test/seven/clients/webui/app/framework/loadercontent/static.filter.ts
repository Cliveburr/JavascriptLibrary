import { ILoaderApplyFilter, ILoaderFilter } from "./loadercontent.model";

export class EqualityApplyFilter implements ILoaderApplyFilter {
    
    private applyResult: boolean;

    public constructor(
        private filter: ILoaderFilter
    ) {
        this.applyResult = (filter.inverse || false) ? false: true;
    }

    public apply(item: any): boolean {
        if (typeof this.filter.value == 'undefined' || this.filter.value === '') {
            return this.applyResult;
        }
        else {
            const itemValue = this.filter.property && this.filter.property != '' && this.filter.property in item ?
                item[this.filter.property] :
                item;
            if (typeof itemValue != 'undefined' &&
                itemValue == this.filter.value) {
                    return this.applyResult;
            }
            return !this.applyResult;
        }
    }
}

export class RegexApplyFilter implements ILoaderApplyFilter {
    
    private applyResult: boolean;
    private regex?: RegExp;

    public constructor(
        private filter: ILoaderFilter
    ) {
        this.applyResult = (filter.inverse || false) ? false: true;
        if (filter.regexPattern) {
            if (filter.value) {
                const pattern = filter.regexPattern.replace('{{value}}', filter.value);
                this.regex = new RegExp(pattern, filter.regexFlags);
            }
            else {
                this.regex = new RegExp(filter.regexPattern, filter.regexFlags);
            }
        }
    }

    public apply(item: any): boolean {
        if (typeof this.filter.value == 'undefined' || this.filter.value === '') {
            return this.applyResult;
        }
        else {
            const itemValue = this.filter.property && this.filter.property != '' && this.filter.property in item ?
                item[this.filter.property] :
                item;
            if (typeof itemValue != 'undefined' &&
                this.regex &&
                this.regex.test(itemValue)) {
                    return this.applyResult;
            }
            return !this.applyResult;
        }
    }
}

export class ContainsApplyFilter implements ILoaderApplyFilter {
    
    private applyResult: boolean;

    public constructor(
        private filter: ILoaderFilter
    ) {
        this.applyResult = (filter.inverse || false) ? false: true;
    }

    public apply(item: any): boolean {
        if (typeof this.filter.value == 'undefined' || this.filter.value === '') {
            return this.applyResult;
        }
        else {
            const itemValue = this.filter.property && this.filter.property != '' && this.filter.property in item ?
                item[this.filter.property] :
                item;
            if (typeof itemValue != 'undefined' &&
                this.filter.value.indexOf(itemValue) > -1) {
                    return this.applyResult;
            }
            return !this.applyResult;
        }
    }
}