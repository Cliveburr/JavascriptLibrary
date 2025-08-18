

export enum BorderShortcuts {
  // Border Width
  border0 = 'border0',
  border1 = 'border1',
  border2 = 'border',
  border3 = 'border3',
  // Border Radius
  rounded0 = 'rounded0',
  rounded1 = 'rounded1',
  rounded2 = 'rounded',
  rounded3 = 'rounded3',
  // Circle
  circle = 'circle'
}

export type BorderShortcutsProps = {
  [K in BorderShortcuts]?: boolean;
};

export interface Border {
  style?: 'none' | 'solid';
  width?: 0 | 1 | 2 | 3;
  rounded?: 0 | 1 | 2 | 3;
  apply?: 'all' | 't' | 'r' | 'b' | 'l' | 'x' | 'y';
}

export class BorderClassBuilder {

    private sets: Border[];

    constructor(border: Border) {
        this.sets = [border];
    }

    set(border: Border): this {
        this.sets.push(border);
        return this;
    }

    build(): string {
        const mergedProps: Border = {};
        
        // Loop pelos sets e merge das propriedades (última sobrescreve)
        for (const borderSet of this.sets) {
            Object.assign(mergedProps, borderSet);
        }

        const classes: string[] = [];

        // Style
        if (mergedProps.style) {
            if (mergedProps.style === 'none') {
                classes.push('border-none');
            } else if (mergedProps.style === 'solid') {
                classes.push('border-solid');
            }
        }

        // Width
        if (mergedProps.width !== undefined) {
            const applyTo = mergedProps.apply || 'all';
            
            if (mergedProps.width === 0) {
                if (applyTo === 'all') {
                    classes.push('border0');
                } else if (applyTo === 't') {
                    classes.push('border-t-0');
                } else if (applyTo === 'r') {
                    classes.push('border-r-0');
                } else if (applyTo === 'b') {
                    classes.push('border-b-0');
                } else if (applyTo === 'l') {
                    classes.push('border-l-0');
                } else if (applyTo === 'x') {
                    classes.push('border-x-0');
                } else if (applyTo === 'y') {
                    classes.push('border-y-0');
                }
            } else if (mergedProps.width === 1) {
                if (applyTo === 'all') {
                    classes.push('border1');
                } else if (applyTo === 't') {
                    classes.push('border-t-1');
                } else if (applyTo === 'r') {
                    classes.push('border-r-1');
                } else if (applyTo === 'b') {
                    classes.push('border-b-1');
                } else if (applyTo === 'l') {
                    classes.push('border-l-1');
                } else if (applyTo === 'x') {
                    classes.push('border-x-1');
                } else if (applyTo === 'y') {
                    classes.push('border-y-1');
                }
            } else if (mergedProps.width === 2) {
                if (applyTo === 'all') {
                    classes.push('border');
                } else if (applyTo === 't') {
                    classes.push('border-t');
                } else if (applyTo === 'r') {
                    classes.push('border-r');
                } else if (applyTo === 'b') {
                    classes.push('border-b');
                } else if (applyTo === 'l') {
                    classes.push('border-l');
                } else if (applyTo === 'x') {
                    classes.push('border-x');
                } else if (applyTo === 'y') {
                    classes.push('border-y');
                }
            } else if (mergedProps.width === 3) {
                if (applyTo === 'all') {
                    classes.push('border3');
                } else if (applyTo === 't') {
                    classes.push('border-t-3');
                } else if (applyTo === 'r') {
                    classes.push('border-r-3');
                } else if (applyTo === 'b') {
                    classes.push('border-b-3');
                } else if (applyTo === 'l') {
                    classes.push('border-l-3');
                } else if (applyTo === 'x') {
                    classes.push('border-x-3');
                } else if (applyTo === 'y') {
                    classes.push('border-y-3');
                }
            }
        }

        // Rounded
        if (mergedProps.rounded !== undefined) {
            if (mergedProps.rounded === 0) {
                classes.push('rounded0');
            } else if (mergedProps.rounded === 1) {
                classes.push('rounded1');
            } else if (mergedProps.rounded === 2) {
                classes.push('rounded');
            } else if (mergedProps.rounded === 3) {
                classes.push('rounded3');
            }
        }

        return classes.join(' ');
    }
}