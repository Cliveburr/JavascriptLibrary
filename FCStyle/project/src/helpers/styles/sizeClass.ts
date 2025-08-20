import { ClassBuilderDef, ifBy, ifSet } from "./classBuilder";

export interface SizeSet {
  width?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  height?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

export interface UtilitySet {
  cursor?: 'pointer';
  display?: 'hide';
}

export interface SizeShortcuts {
  // Size sets
  size?: SizeSet;
  utility?: UtilitySet;
  
  // Width shortcuts
  w1?: boolean;   // 100%
  w2?: boolean;   // 50%
  w3?: boolean;   // 33.33%
  w4?: boolean;   // 25%
  w5?: boolean;   // 20%
  w6?: boolean;   // 16.66%
  w7?: boolean;   // 14.25%
  w8?: boolean;   // 12.5%
  w9?: boolean;   // 11.11%
  w10?: boolean;  // 10%
  
  // Height shortcuts
  h1?: boolean;   // 100%
  h2?: boolean;   // 50%
  h3?: boolean;   // 33.33%
  h4?: boolean;   // 25%
  h5?: boolean;   // 20%
  h6?: boolean;   // 16.66%
  h7?: boolean;   // 14.25%
  h8?: boolean;   // 12.5%
  h9?: boolean;   // 11.11%
  h10?: boolean;  // 10%
  
  // Utility shortcuts
  pointer?: boolean;
  hide?: boolean;
}

// Helper functions for generating size classes
const generateWidthClass = (width: number): string => {
  return `w${width}`;
};

const generateHeightClass = (height: number): string => {
  return `h${height}`;
};

const generateUtilityClass = (type: 'cursor' | 'display', value: string): string => {
  if (type === 'cursor' && value === 'pointer') {
    return 'pointer';
  }
  if (type === 'display' && value === 'hide') {
    return 'hide';
  }
  return '';
};

export const SizeBuilder: ClassBuilderDef<SizeSet> = {
  props: {
    'size': ifBy,
    // Width shortcuts
    'w1': ifSet({ width: 1 }),
    'w2': ifSet({ width: 2 }),
    'w3': ifSet({ width: 3 }),
    'w4': ifSet({ width: 4 }),
    'w5': ifSet({ width: 5 }),
    'w6': ifSet({ width: 6 }),
    'w7': ifSet({ width: 7 }),
    'w8': ifSet({ width: 8 }),
    'w9': ifSet({ width: 9 }),
    'w10': ifSet({ width: 10 }),
    // Height shortcuts
    'h1': ifSet({ height: 1 }),
    'h2': ifSet({ height: 2 }),
    'h3': ifSet({ height: 3 }),
    'h4': ifSet({ height: 4 }),
    'h5': ifSet({ height: 5 }),
    'h6': ifSet({ height: 6 }),
    'h7': ifSet({ height: 7 }),
    'h8': ifSet({ height: 8 }),
    'h9': ifSet({ height: 9 }),
    'h10': ifSet({ height: 10 })
  },
  process: (sets: SizeSet[]): string => {
    const mergedProps: SizeSet = {};
    
    // Loop pelos sets e merge das propriedades (última sobrescreve)
    for (const sizeSet of sets) {
      Object.assign(mergedProps, sizeSet);
    }

    const classes: string[] = [];

    // Width
    if (mergedProps.width !== undefined) {
      const widthClass = generateWidthClass(mergedProps.width);
      if (widthClass) classes.push(widthClass);
    }

    // Height
    if (mergedProps.height !== undefined) {
      const heightClass = generateHeightClass(mergedProps.height);
      if (heightClass) classes.push(heightClass);
    }

    return classes.join(' ');
  }
};

export const UtilityBuilder: ClassBuilderDef<UtilitySet> = {
  props: {
    'utility': ifBy,
    // Utility shortcuts
    'pointer': ifSet({ cursor: 'pointer' }),
    'hide': ifSet({ display: 'hide' })
  },
  process: (sets: UtilitySet[]): string => {
    const mergedProps: UtilitySet = {};
    
    // Loop pelos sets e merge das propriedades (última sobrescreve)
    for (const utilitySet of sets) {
      Object.assign(mergedProps, utilitySet);
    }

    const classes: string[] = [];

    // Cursor
    if (mergedProps.cursor) {
      const cursorClass = generateUtilityClass('cursor', mergedProps.cursor);
      if (cursorClass) classes.push(cursorClass);
    }

    // Display
    if (mergedProps.display) {
      const displayClass = generateUtilityClass('display', mergedProps.display);
      if (displayClass) classes.push(displayClass);
    }

    return classes.join(' ');
  }
};