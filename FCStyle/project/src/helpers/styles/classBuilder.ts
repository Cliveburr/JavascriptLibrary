
export interface PropsSelectorCheck<T> {
    (prop: any): T | undefined;
}

export interface PropsSelector<T> {
    [key: string]: PropsSelectorCheck<T>;
}

export const ifBy = <T>(value: T): T | undefined => {
    return (typeof value === 'object' ? value : undefined);
}

export const ifSet = <T>(value: T): PropsSelectorCheck<T> => {
    return (prop: any): T | undefined => {
        return prop ? value : undefined;
    }
}

export interface ClassBuilderDef<T> {
    props: PropsSelector<T>,
    process: (sets: T[]) => string;
}

export class ClassBuilder {

    private cls: string[];
    private builders?: ClassBuilderDef<any>[];
    
    constructor(
        ...cls: string[]
    ) {
        this.cls = cls
            .map(c => c.trim())
            .filter(c => c != '');
    }

    add(className?: string): this {
        if (className) {
            this.cls.push(className);
        }
        return this;
    }

    if(className: string, check?: boolean): this {
        if (check) {
            this.cls.push(className);
        }
        return this;
    }

    addBuilder<T>(builder: ClassBuilderDef<T>): this {
        if (this.builders) {
            this.builders.push(builder);
        }
        else {
            this.builders = [builder];
        }
        return this;
    }

    processBuilder(builder: ClassBuilderDef<any>, props: any): void {
        const sets = [];
        for (let prop in props) {
            if (prop in builder.props) {
                const check = builder.props[prop](props[prop]);
                if (check) {
                    sets.push(check);
                    delete props[prop];
                }
            }
        }
        if (sets.length > 0) {
            const builderClasses = builder.process(sets);
            if (builderClasses.length > 0) {
                this.cls.push(builderClasses);
            }
        }
    }

    build(props: any): { domProps: any, classNames: string} {

        const domProps: any = { ...props };

        if (this.builders) {
            for (const builder of this.builders) {
                this.processBuilder(builder, domProps);
            }
        }

        const classNames = this.cls
            .join(' ');

        return { domProps, classNames };
    }
}

export function classBuilder(...cls: string[]): ClassBuilder {
    return new ClassBuilder(...cls);
}