
import { ClassBuilderDef, ifBy, ifSet } from "./classBuilder";

export interface FlexSet {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'reverse';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' |
    'space-around' | 'space-evenly' | 'start' | 'end' | 'left' | 'right';
  align?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline' |
    'first-baseline' | 'last-baseline' | 'start' | 'end' | 'self-start' | 'self-end';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' |
    'space-around' | 'space-evenly' | 'stretch' | 'start' | 'end' | 'baseline' |
    'first-baseline' | 'last-baseline';
  gap?: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface FlexChildrenSet {
  order?: number;
  grow?: number;
  shrink?: number;
  basis?: 0 | 1 | 2 | 3 | 'auto';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
}

export interface FlexShortcuts {
  // Flex container set
  flex?: FlexSet;
  
  // Direction shortcuts
  row?: boolean;
  flexRowReverse?: boolean;
  column?: boolean;
  flexColumnReverse?: boolean;
  
  // Wrap shortcuts
  flexWrap?: boolean;
  flexWrapReverse?: boolean;
  flexNowrap?: boolean;
  
  // Justify content shortcuts
  justifyStart?: boolean;
  justifyEnd?: boolean;
  justifyCenter?: boolean;
  justifyBetween?: boolean;
  justifyAround?: boolean;
  justifyEvenly?: boolean;
  
  // Align items shortcuts
  alignStart?: boolean;
  alignEnd?: boolean;
  alignCenter?: boolean;
  alignStretch?: boolean;
  alignBaseline?: boolean;
  
  // Align content shortcuts
  alignContentStart?: boolean;
  alignContentEnd?: boolean;
  alignContentCenter?: boolean;
  alignContentBetween?: boolean;
  alignContentAround?: boolean;
  alignContentEvenly?: boolean;
  alignContentStretch?: boolean;
  
  // Gap shortcuts
  gap0?: boolean;
  gap1?: boolean;
  gap2?: boolean;
  gap?: boolean;
  gap4?: boolean;
  gap5?: boolean;
}

export interface FlexChildrenShortcuts {
  // Flex children set
  flexChildren?: FlexChildrenSet;
  
  // Order shortcuts (0-5)
  order0?: boolean;
  order1?: boolean;
  order2?: boolean;
  order3?: boolean;
  order4?: boolean;
  order5?: boolean;
  
  // Grow shortcuts (0-3)
  grow0?: boolean;
  grow1?: boolean;
  grow2?: boolean;
  grow3?: boolean;
  
  // Shrink shortcuts (0-3)
  shrink0?: boolean;
  shrink1?: boolean;
  shrink2?: boolean;
  shrink3?: boolean;
  
  // Basis shortcuts
  basis0?: boolean;
  basis1?: boolean;
  basis2?: boolean;
  basis3?: boolean;
  basisAuto?: boolean;
  
  // Align self shortcuts
  alignSelfAuto?: boolean;
  alignSelfStart?: boolean;
  alignSelfEnd?: boolean;
  alignSelfCenter?: boolean;
  alignSelfBaseline?: boolean;
  alignSelfStretch?: boolean;
}

// Helper functions for generating flex classes
const generateFlexDirectionClass = (direction: string): string => {
  if (direction === 'row') return 'flex-row';
  if (direction === 'row-reverse') return 'flex-row inverse';
  if (direction === 'column') return 'flex-column';
  if (direction === 'column-reverse') return 'flex-column inverse';
  return '';
};

const generateFlexWrapClass = (wrap: string): string => {
  if (wrap === 'wrap') return 'wrap';
  if (wrap === 'reverse') return 'wrap-reverse';
  if (wrap === 'nowrap') return 'nowrap';
  return '';
};

const generateJustifyClass = (justify: string): string => {
  if (justify === 'flex-start' || justify === 'start') return 'justify-start';
  if (justify === 'flex-end' || justify === 'end') return 'justify-end';
  if (justify === 'center') return 'justify-center';
  if (justify === 'space-between') return 'justify-between';
  if (justify === 'space-around') return 'justify-around';
  if (justify === 'space-evenly') return 'justify-evenly';
  return '';
};

const generateAlignClass = (align: string): string => {
  if (align === 'stretch') return 'align-stretch';
  if (align === 'flex-start' || align === 'start' || align === 'self-start') return 'align-start';
  if (align === 'flex-end' || align === 'end' || align === 'self-end') return 'align-end';
  if (align === 'center') return 'align-center';
  if (align === 'baseline' || align === 'first-baseline' || align === 'last-baseline') return 'align-baseline';
  return '';
};

const generateAlignContentClass = (alignContent: string): string => {
  if (alignContent === 'flex-start' || alignContent === 'start') return 'align-content-start';
  if (alignContent === 'flex-end' || alignContent === 'end') return 'align-content-end';
  if (alignContent === 'center') return 'align-content-center';
  if (alignContent === 'space-between') return 'align-content-between';
  if (alignContent === 'space-around') return 'align-content-around';
  if (alignContent === 'space-evenly') return 'align-content-evenly';
  if (alignContent === 'stretch') return 'align-content-stretch';
  if (alignContent === 'baseline' || alignContent === 'first-baseline' || alignContent === 'last-baseline') return 'align-content-start';
  return '';
};

const generateGapClass = (gap: number): string => {
  return `gap${gap}`;
};

export const FlexBuilder: ClassBuilderDef<FlexSet> = {
  props: {
    'flex': ifBy,
    // Direction shortcuts
    'row': ifSet({ direction: 'row' }),
    'flexRowReverse': ifSet({ direction: 'row-reverse' }),
    'column': ifSet({ direction: 'column' }),
    'flexColumnReverse': ifSet({ direction: 'column-reverse' }),
    // Wrap shortcuts
    'flexWrap': ifSet({ wrap: 'wrap' }),
    'flexWrapReverse': ifSet({ wrap: 'reverse' }),
    'flexNowrap': ifSet({ wrap: 'nowrap' }),
    // Justify content shortcuts
    'justifyStart': ifSet({ justify: 'flex-start' }),
    'justifyEnd': ifSet({ justify: 'flex-end' }),
    'justifyCenter': ifSet({ justify: 'center' }),
    'justifyBetween': ifSet({ justify: 'space-between' }),
    'justifyAround': ifSet({ justify: 'space-around' }),
    'justifyEvenly': ifSet({ justify: 'space-evenly' }),
    // Align items shortcuts
    'alignStart': ifSet({ align: 'flex-start' }),
    'alignEnd': ifSet({ align: 'flex-end' }),
    'alignCenter': ifSet({ align: 'center' }),
    'alignStretch': ifSet({ align: 'stretch' }),
    'alignBaseline': ifSet({ align: 'baseline' }),
    // Align content shortcuts
    'alignContentStart': ifSet({ alignContent: 'flex-start' }),
    'alignContentEnd': ifSet({ alignContent: 'flex-end' }),
    'alignContentCenter': ifSet({ alignContent: 'center' }),
    'alignContentBetween': ifSet({ alignContent: 'space-between' }),
    'alignContentAround': ifSet({ alignContent: 'space-around' }),
    'alignContentEvenly': ifSet({ alignContent: 'space-evenly' }),
    'alignContentStretch': ifSet({ alignContent: 'stretch' }),
    // Gap shortcuts
    'gap0': ifSet({ gap: 0 }),
    'gap1': ifSet({ gap: 1 }),
    'gap2': ifSet({ gap: 2 }),
    'gap': ifSet({ gap: 3 }),
    'gap4': ifSet({ gap: 4 }),
    'gap5': ifSet({ gap: 5 })
  },
  process: (sets: FlexSet[]): string => {
    const mergedProps: FlexSet = {};
    
    // Loop pelos sets e merge das propriedades (última sobrescreve)
    for (const flexSet of sets) {
      Object.assign(mergedProps, flexSet);
    }

    const classes: string[] = [];

    // Direction
    if (mergedProps.direction) {
      const directionClass = generateFlexDirectionClass(mergedProps.direction);
      if (directionClass) classes.push(directionClass);
    }

    // Wrap
    if (mergedProps.wrap) {
      const wrapClass = generateFlexWrapClass(mergedProps.wrap);
      if (wrapClass) classes.push(wrapClass);
    }

    // Justify content
    if (mergedProps.justify) {
      const justifyClass = generateJustifyClass(mergedProps.justify);
      if (justifyClass) classes.push(justifyClass);
    }

    // Align items
    if (mergedProps.align) {
      const alignClass = generateAlignClass(mergedProps.align);
      if (alignClass) classes.push(alignClass);
    }

    // Align content
    if (mergedProps.alignContent) {
      const alignContentClass = generateAlignContentClass(mergedProps.alignContent);
      if (alignContentClass) classes.push(alignContentClass);
    }

    // Gap
    if (mergedProps.gap !== undefined) {
      const gapClass = generateGapClass(mergedProps.gap);
      if (gapClass) classes.push(gapClass);
    }

    return classes.join(' ');
  }
};

export const FlexChildrenBuilder: ClassBuilderDef<FlexChildrenSet> = {
  props: {
    'flexChildren': ifBy,
    // Order shortcuts (0-5)
    'order0': ifSet({ order: 0 }),
    'order1': ifSet({ order: 1 }),
    'order2': ifSet({ order: 2 }),
    'order3': ifSet({ order: 3 }),
    'order4': ifSet({ order: 4 }),
    'order5': ifSet({ order: 5 }),
    // Grow shortcuts (0-3)
    'grow0': ifSet({ grow: 0 }),
    'grow1': ifSet({ grow: 1 }),
    'grow2': ifSet({ grow: 2 }),
    'grow3': ifSet({ grow: 3 }),
    // Shrink shortcuts (0-3)
    'shrink0': ifSet({ shrink: 0 }),
    'shrink1': ifSet({ shrink: 1 }),
    'shrink2': ifSet({ shrink: 2 }),
    'shrink3': ifSet({ shrink: 3 }),
    // Basis shortcuts
    'basis0': ifSet({ basis: 0 }),
    'basis1': ifSet({ basis: 1 }),
    'basis2': ifSet({ basis: 2 }),
    'basis3': ifSet({ basis: 3 }),
    'basisAuto': ifSet({ basis: 'auto' }),
    // Align self shortcuts
    'alignSelfAuto': ifSet({ alignSelf: 'auto' }),
    'alignSelfStart': ifSet({ alignSelf: 'flex-start' }),
    'alignSelfEnd': ifSet({ alignSelf: 'flex-end' }),
    'alignSelfCenter': ifSet({ alignSelf: 'center' }),
    'alignSelfBaseline': ifSet({ alignSelf: 'baseline' }),
    'alignSelfStretch': ifSet({ alignSelf: 'stretch' })
  },
  process: (sets: FlexChildrenSet[]): string => {
    const mergedProps: FlexChildrenSet = {};
    
    // Loop pelos sets e merge das propriedades (última sobrescreve)
    for (const flexChildrenSet of sets) {
      Object.assign(mergedProps, flexChildrenSet);
    }

    const classes: string[] = [];

    // Order
    if (mergedProps.order !== undefined) {
      if (mergedProps.order >= 0 && mergedProps.order <= 5) {
        classes.push(`flex-order-${mergedProps.order}`);
      }
    }

    // Grow
    if (mergedProps.grow !== undefined) {
      if (mergedProps.grow >= 0 && mergedProps.grow <= 3) {
        classes.push(`flex-grow-${mergedProps.grow}`);
      }
    }

    // Shrink
    if (mergedProps.shrink !== undefined) {
      if (mergedProps.shrink >= 0 && mergedProps.shrink <= 3) {
        classes.push(`flex-shrink-${mergedProps.shrink}`);
      }
    }

    // Basis
    if (mergedProps.basis !== undefined) {
      if (mergedProps.basis === 'auto') {
        classes.push('flex-basis-auto');
      } else if (mergedProps.basis >= 0 && mergedProps.basis <= 3) {
        classes.push(`flex-basis-${mergedProps.basis}`);
      }
    }

    // Align Self
    if (mergedProps.alignSelf) {
      if (mergedProps.alignSelf === 'auto') {
        classes.push('align-self-auto');
      } else if (mergedProps.alignSelf === 'flex-start') {
        classes.push('align-self-start');
      } else if (mergedProps.alignSelf === 'flex-end') {
        classes.push('align-self-end');
      } else if (mergedProps.alignSelf === 'center') {
        classes.push('align-self-center');
      } else if (mergedProps.alignSelf === 'baseline') {
        classes.push('align-self-baseline');
      } else if (mergedProps.alignSelf === 'stretch') {
        classes.push('align-self-stretch');
      }
    }

    return classes.join(' ');
  }
};
