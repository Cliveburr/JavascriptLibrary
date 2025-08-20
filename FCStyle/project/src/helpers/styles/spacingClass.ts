
import { ClassBuilderDef, ifBy, ifSet } from "./classBuilder";

export interface MarginSet {
  size?: 1 | 2 | 3 | 4 | 5 | 0 | 'a';
  apply?: 'all' | 't' | 'r' | 'b' | 'l' | 'x' | 'y';
}

export interface PaddingSet {
  size?: 1 | 2 | 3 | 4 | 5 | 0;
  apply?: 'all' | 't' | 'r' | 'b' | 'l' | 'x' | 'y';
}

export interface MarginShortcuts {
  // Margin sets
  margin?: MarginSet;
  
  // Margin shortcuts - all directions
  m0?: boolean;
  m1?: boolean;
  m2?: boolean;
  m?: boolean;
  m4?: boolean;
  m5?: boolean;
  ma?: boolean;
  
  // Margin Top
  mt0?: boolean;
  mt1?: boolean;
  mt2?: boolean;
  mt?: boolean;
  mt4?: boolean;
  mt5?: boolean;
  mta?: boolean;
  
  // Margin Right  
  mr0?: boolean;
  mr1?: boolean;
  mr2?: boolean;
  mr?: boolean;
  mr4?: boolean;
  mr5?: boolean;
  mra?: boolean;
  
  // Margin Bottom
  mb0?: boolean;
  mb1?: boolean;
  mb2?: boolean;
  mb?: boolean;
  mb4?: boolean;
  mb5?: boolean;
  mba?: boolean;
  
  // Margin Left
  ml0?: boolean;
  ml1?: boolean;
  ml2?: boolean;
  ml?: boolean;
  ml4?: boolean;
  ml5?: boolean;
  mla?: boolean;
  
  // Margin X (horizontal)
  mx0?: boolean;
  mx1?: boolean;
  mx2?: boolean;
  mx?: boolean;
  mx4?: boolean;
  mx5?: boolean;
  mxa?: boolean;
  
  // Margin Y (vertical)  
  my0?: boolean;
  my1?: boolean;
  my2?: boolean;
  my?: boolean;
  my4?: boolean;
  my5?: boolean;
  mya?: boolean;
}

export interface PaddingShortcuts {
  // Margin sets
  padding?: PaddingSet;

  // Padding shortcuts - all directions
  p0?: boolean;
  p1?: boolean;
  p2?: boolean;
  p?: boolean;
  p4?: boolean;
  p5?: boolean;
  
  // Padding Top
  pt0?: boolean;
  pt1?: boolean;
  pt2?: boolean;
  pt?: boolean;
  pt4?: boolean;
  pt5?: boolean;
  
  // Padding Right
  pr0?: boolean;
  pr1?: boolean;
  pr2?: boolean;
  pr?: boolean;
  pr4?: boolean;
  pr5?: boolean;
  
  // Padding Bottom
  pb0?: boolean;
  pb1?: boolean;
  pb2?: boolean;
  pb?: boolean;
  pb4?: boolean;
  pb5?: boolean;
  
  // Padding Left
  pl0?: boolean;
  pl1?: boolean;
  pl2?: boolean;
  pl?: boolean;
  pl4?: boolean;
  pl5?: boolean;
  
  // Padding X (horizontal)
  px0?: boolean;
  px1?: boolean;
  px2?: boolean;
  px?: boolean;
  px4?: boolean;
  px5?: boolean;
  
  // Padding Y (vertical)
  py0?: boolean;
  py1?: boolean;
  py2?: boolean;
  py?: boolean;
  py4?: boolean;
  py5?: boolean;
}

// Helper functions for generating spacing classes
const generateMarginClass = (size: number | 'a', apply: string): string => {
  const direction = apply === 'all' ? '' : apply;
  return `m${size}${direction}`;
};

const generatePaddingClass = (size: number, apply: string): string => {
  const direction = apply === 'all' ? '' : apply;
  return `p${size}${direction}`;
};

export const MarginBuilder: ClassBuilderDef<MarginSet> = {
  props: {
    'margin': ifBy,
    // All directions
    'm0': ifSet({ size: 0 }),
    'm1': ifSet({ size: 1 }),
    'm2': ifSet({ size: 2 }),
    'm': ifSet({ size: 3 }),
    'm4': ifSet({ size: 4 }),
    'm5': ifSet({ size: 5 }),
    'ma': ifSet({ size: 'a' }),
    // Top
    'mt0': ifSet({ size: 0, apply: 't' }),
    'mt1': ifSet({ size: 1, apply: 't' }),
    'mt2': ifSet({ size: 2, apply: 't' }),
    'mt': ifSet({ size: 3, apply: 't' }),
    'mt4': ifSet({ size: 4, apply: 't' }),
    'mt5': ifSet({ size: 5, apply: 't' }),
    'mta': ifSet({ size: 'a', apply: 't' }),
    // Right
    'mr0': ifSet({ size: 0, apply: 'r' }),
    'mr1': ifSet({ size: 1, apply: 'r' }),
    'mr2': ifSet({ size: 2, apply: 'r' }),
    'mr': ifSet({ size: 3, apply: 'r' }),
    'mr4': ifSet({ size: 4, apply: 'r' }),
    'mr5': ifSet({ size: 5, apply: 'r' }),
    'mra': ifSet({ size: 'a', apply: 'r' }),
    // Bottom
    'mb0': ifSet({ size: 0, apply: 'b' }),
    'mb1': ifSet({ size: 1, apply: 'b' }),
    'mb2': ifSet({ size: 2, apply: 'b' }),
    'mb': ifSet({ size: 3, apply: 'b' }),
    'mb4': ifSet({ size: 4, apply: 'b' }),
    'mb5': ifSet({ size: 5, apply: 'b' }),
    'mba': ifSet({ size: 'a', apply: 'b' }),
    // Left
    'ml0': ifSet({ size: 0, apply: 'l' }),
    'ml1': ifSet({ size: 1, apply: 'l' }),
    'ml2': ifSet({ size: 2, apply: 'l' }),
    'ml': ifSet({ size: 3, apply: 'l' }),
    'ml4': ifSet({ size: 4, apply: 'l' }),
    'ml5': ifSet({ size: 5, apply: 'l' }),
    'mla': ifSet({ size: 'a', apply: 'l' }),
    // X (horizontal)
    'mx0': ifSet({ size: 0, apply: 'x' }),
    'mx1': ifSet({ size: 1, apply: 'x' }),
    'mx2': ifSet({ size: 2, apply: 'x' }),
    'mx': ifSet({ size: 3, apply: 'x' }),
    'mx4': ifSet({ size: 4, apply: 'x' }),
    'mx5': ifSet({ size: 5, apply: 'x' }),
    'mxa': ifSet({ size: 'a', apply: 'x' }),
    // Y (vertical)
    'my0': ifSet({ size: 0, apply: 'y' }),
    'my1': ifSet({ size: 1, apply: 'y' }),
    'my2': ifSet({ size: 2, apply: 'y' }),
    'my': ifSet({ size: 3, apply: 'y' }),
    'my4': ifSet({ size: 4, apply: 'y' }),
    'my5': ifSet({ size: 5, apply: 'y' }),
    'mya': ifSet({ size: 'a', apply: 'y' })
  },
  process: (sets: MarginSet[]): string => {
    const mergedProps: MarginSet = {};
    
    // Loop pelos sets e merge das propriedades (última sobrescreve)
    for (const marginSet of sets) {
      Object.assign(mergedProps, marginSet);
    }

    if (mergedProps.size !== undefined) {
      const applyTo = mergedProps.apply || 'all';
      return generateMarginClass(mergedProps.size, applyTo);
    }

    return '';
  }
};

export const PaddingBuilder: ClassBuilderDef<PaddingSet> = {
  props: {
    'padding': ifBy,
    // All directions
    'p0': ifSet({ size: 0 }),
    'p1': ifSet({ size: 1 }),
    'p2': ifSet({ size: 2 }),
    'p': ifSet({ size: 3 }),
    'p4': ifSet({ size: 4 }),
    'p5': ifSet({ size: 5 }),
    // Top
    'pt0': ifSet({ size: 0, apply: 't' }),
    'pt1': ifSet({ size: 1, apply: 't' }),
    'pt2': ifSet({ size: 2, apply: 't' }),
    'pt': ifSet({ size: 3, apply: 't' }),
    'pt4': ifSet({ size: 4, apply: 't' }),
    'pt5': ifSet({ size: 5, apply: 't' }),
    // Right
    'pr0': ifSet({ size: 0, apply: 'r' }),
    'pr1': ifSet({ size: 1, apply: 'r' }),
    'pr2': ifSet({ size: 2, apply: 'r' }),
    'pr': ifSet({ size: 3, apply: 'r' }),
    'pr4': ifSet({ size: 4, apply: 'r' }),
    'pr5': ifSet({ size: 5, apply: 'r' }),
    // Bottom
    'pb0': ifSet({ size: 0, apply: 'b' }),
    'pb1': ifSet({ size: 1, apply: 'b' }),
    'pb2': ifSet({ size: 2, apply: 'b' }),
    'pb': ifSet({ size: 3, apply: 'b' }),
    'pb4': ifSet({ size: 4, apply: 'b' }),
    'pb5': ifSet({ size: 5, apply: 'b' }),
    // Left
    'pl0': ifSet({ size: 0, apply: 'l' }),
    'pl1': ifSet({ size: 1, apply: 'l' }),
    'pl2': ifSet({ size: 2, apply: 'l' }),
    'pl': ifSet({ size: 3, apply: 'l' }),
    'pl4': ifSet({ size: 4, apply: 'l' }),
    'pl5': ifSet({ size: 5, apply: 'l' }),
    // X (horizontal)
    'px0': ifSet({ size: 0, apply: 'x' }),
    'px1': ifSet({ size: 1, apply: 'x' }),
    'px2': ifSet({ size: 2, apply: 'x' }),
    'px': ifSet({ size: 3, apply: 'x' }),
    'px4': ifSet({ size: 4, apply: 'x' }),
    'px5': ifSet({ size: 5, apply: 'x' }),
    // Y (vertical)
    'py0': ifSet({ size: 0, apply: 'y' }),
    'py1': ifSet({ size: 1, apply: 'y' }),
    'py2': ifSet({ size: 2, apply: 'y' }),
    'py': ifSet({ size: 3, apply: 'y' }),
    'py4': ifSet({ size: 4, apply: 'y' }),
    'py5': ifSet({ size: 5, apply: 'y' })
  },
  process: (sets: PaddingSet[]): string => {
    const mergedProps: PaddingSet = {};
    
    // Loop pelos sets e merge das propriedades (última sobrescreve)
    for (const paddingSet of sets) {
      Object.assign(mergedProps, paddingSet);
    }

    if (mergedProps.size !== undefined) {
      const applyTo = mergedProps.apply || 'all';
      return generatePaddingClass(mergedProps.size, applyTo);
    }

    return '';
  }
};
