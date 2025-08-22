
import { ClassBuilderDef, ifBy, ifSet } from "./classBuilder";

export interface ColorSet {
  variant?: 'white' | 'one' | 'two' | 'three' | 'four' | 'five' | 'six' | 'seven' | 'success' | 'warning' | 'danger';
  hoverable?: boolean;
  selected?: boolean;
}

export interface ColorShortcuts {
  // Color set
  colorSet?: ColorSet;
  
  // Numeric color shortcuts
  white?: boolean;
  one?: boolean;
  two?: boolean;
  three?: boolean;
  four?: boolean;
  five?: boolean;
  six?: boolean;
  seven?: boolean;
  
  // Semantic color shortcuts
  success?: boolean;
  warning?: boolean;
  danger?: boolean;
  
  // State shortcuts
  hoverable?: boolean;
  selected?: boolean;
}

// Helper function for generating color classes
const generateColorClass = (variant: string, hoverable?: boolean, selected?: boolean): string => {
  const classes: string[] = [variant];
  
  if (hoverable) {
    classes.push('hoverable');
  }
  
  if (selected) {
    classes.push('selected');
  }
  
  return classes.join(' ');
};

export const ColorBuilder: ClassBuilderDef<ColorSet> = {
  props: {
    'color': ifBy,
    // Numeric colors
    'white': ifSet({ variant: 'white' }),
    'one': ifSet({ variant: 'one' }),
    'two': ifSet({ variant: 'two' }),
    'three': ifSet({ variant: 'three' }),
    'four': ifSet({ variant: 'four' }),
    'five': ifSet({ variant: 'five' }),
    'six': ifSet({ variant: 'six' }),
    'seven': ifSet({ variant: 'seven' }),
    // Semantic colors
    'success': ifSet({ variant: 'success' }),
    'warning': ifSet({ variant: 'warning' }),
    'danger': ifSet({ variant: 'danger' }),
    // States
    'hoverable': ifSet({ hoverable: true }),
    'selected': ifSet({ selected: true })
  },
  process: (sets: ColorSet[]): string => {
    const mergedProps: ColorSet = {};
    
    // Loop pelos sets e merge das propriedades (última sobrescreve)
    for (const colorSet of sets) {
      Object.assign(mergedProps, colorSet);
    }

    if (mergedProps.variant) {
      return generateColorClass(mergedProps.variant, mergedProps.hoverable, mergedProps.selected);
    }

    const classes: string[] = [];
    
    // Se não há variant mas há states, adiciona apenas os states
    if (mergedProps.hoverable) {
      classes.push('hoverable');
    }
    
    if (mergedProps.selected) {
      classes.push('selected');
    }

    return classes.join(' ');
  }
};
