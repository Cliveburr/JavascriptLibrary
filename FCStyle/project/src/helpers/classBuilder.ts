import { Flex, FlexChildren, FlexChildrenClassBuilder, FlexClassBuilder } from "./flexClass";

export class ClassBuilder {

    private cls: string[];
    private flex?: FlexClassBuilder;
    private flexChildren?: FlexChildrenClassBuilder;
    private enums?: any[];
    
    constructor(
        ...cls: string[]
    ) {
        this.cls = cls
            .map(c => c.trim())
            .filter(c => c != '');
    }

    if(className: string, check?: boolean): this {
        if (check) {
            this.cls.push(className);
        }
        return this;
    }

    ofType<T extends Record<string, string>>(enumObj: T): this {
        if (this.enums) {
            this.enums.push(enumObj);
        }
        else {
            this.enums = [enumObj];
        }
        return this;
    }

    addFlex(flex?: Flex): this {
        if (flex) {
            if (this.flex) {
                this.flex.set(flex);
            }
            else {
                this.flex = new FlexClassBuilder(flex);
            }
        }
        return this;
    }

    addChildrenFlex(flex: FlexChildren): this {
        if (flex) {
            if (this.flexChildren) {
                this.flexChildren.set(flex);
            }
            else {
                this.flexChildren = new FlexChildrenClassBuilder(flex);
            }
        }
        return this;
    }

    private filterStylePropsBy(style: any[], props: any): any {
        const allStyleKeys = style.map(s => Object.values(s)).flat();
        
        const filteredProps = { ...props };
        allStyleKeys.forEach((key: any) => {
            delete filteredProps[key];
        });
        
        return filteredProps;
    }

    build(props: any): { domProps: any, classNames: string} {

        const domProps = this.enums ?
            this.filterStylePropsBy(this.enums, props)
            : {};

        if (this.enums) {
            for (const enumObj of this.enums) {
                const enumValues = Object.keys(props).filter(key => 
                    Object.values(enumObj).includes(key) && props[key as keyof typeof props]
                );
                const value = enumValues[0];
                if (value) {
                    this.cls.push(value);
                }
            }
        }

        if (this.flex) {
            this.cls.push(this.flex.build());
        }
        if (this.flexChildren) {
            this.cls.push(this.flexChildren.build());
        }
        const classNames = this.cls
            .join(' ');

        return { domProps, classNames };
    }
}

export function classBuilder(...cls: string[]): ClassBuilder {
    return new ClassBuilder(...cls);
}