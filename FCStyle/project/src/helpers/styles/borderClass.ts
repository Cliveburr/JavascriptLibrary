import { ClassBuilderDef, ifBy, ifSet } from "./classBuilder";

export interface BorderSet {
  style?: 'none' | 'solid';
  width?: 0 | 1 | 2 | 3;
  round?: 0 | 1 | 2 | 3 | 'F';
  apply?: 'all' | 't' | 'r' | 'b' | 'l' | 'x' | 'y';
}

export interface BorderShortcuts {
  // Border sets
  border?: BorderSet;
  // Border Width
  b0?: boolean;
  b1?: boolean;
  b?: boolean;
  b3?: boolean;
  // Border Radius
  br0?: boolean;
  br1?: boolean;
  br?: boolean;
  br3?: boolean;
  // Circle
  circle?: boolean;
}

// Helper functions for generating border classes
const generateBorderWidthClass = (width: number, apply: string): string => {
    const direction = apply === 'all' ? '' : apply;
    return `border${width}${direction}`;
};

const generateBorderRoundClass = (round: 0 | 1 | 2 | 3 | 'F', apply?: string): string => {
    const direction = apply && apply !== 'all' ? apply : '';
    return `round${round}${direction}`;
};

const processBorderStyle = (style: string, classes: string[]): void => {
    if (style === 'none') {
        classes.push('border0');
    } else if (style === 'solid') {
        classes.push('border2');
    }
};

const processBorderWidth = (width: number, apply: string, classes: string[]): void => {
    classes.push(generateBorderWidthClass(width, apply));
};

const processBorderRound = (rounded: 0 | 1 | 2 | 3 | 'F', apply: string | undefined, classes: string[]): void => {
    classes.push(generateBorderRoundClass(rounded, apply));
};

export const BorderBuilder: ClassBuilderDef<BorderSet> = {
    props: {
        'border': ifBy,
        'b0': ifSet({ width: 0}),
        'b1': ifSet({ width: 1}),
        'b': ifSet({ width: 2}),
        'b3': ifSet({ width: 3}),
        'br0': ifSet({ round: 0}),
        'br1': ifSet({ round: 1}),
        'br': ifSet({ round: 2}),
        'br3': ifSet({ round: 3}),
        'circle': ifSet({ width: 2, round: 'F'})
    },
    process: (sets: BorderSet[]): string => {
        const mergedProps: BorderSet = {};
        
        // Loop pelos sets e merge das propriedades (última sobrescreve)
        for (const borderSet of sets) {
            Object.assign(mergedProps, borderSet);
        }

        const classes: string[] = [];

        // Style
        if (mergedProps.style) {
            processBorderStyle(mergedProps.style, classes);
        }

        // Width
        if (mergedProps.width !== undefined) {
            const applyTo = mergedProps.apply || 'all';
            processBorderWidth(mergedProps.width, applyTo, classes);
        }

        // Rounded
        if (mergedProps.round !== undefined) {
            processBorderRound(mergedProps.round, mergedProps.apply, classes);
        }

        return classes.join(' ');
    }
}
