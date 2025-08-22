import { ClassBuilderDef, ifBy, ifSet } from "./classBuilder";

export interface FontSizeSet {
  size?: 1 | 2 | 3 | 4 | 5;
}

export interface FontFamilySet {
  family?: 'one' | 'two' | 'three' | 'four' | 'five';
}

export interface FontWeightSet {
  weight?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export interface TextTransformSet {
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface LineHeightSet {
  leading?: 1 | 2 | 3 | 4;
}

export interface LetterSpacingSet {
  spacing?: 1 | 2 | 3 | 4 | 5;
}

export interface TypographyPresetSet {
  preset?: 'heading' | 'body' | 'caption' | 'label' | 'code';
}

export interface TypographyShortcuts {
  // Typography sets
  fontSize?: FontSizeSet;
  fontFamily?: FontFamilySet;
  fontWeight?: FontWeightSet;
  textTransform?: TextTransformSet;
  lineHeight?: LineHeightSet;
  letterSpacing?: LetterSpacingSet;
  typography?: TypographyPresetSet;
  
  // Font size shortcuts
  textSize1?: boolean;
  textSize2?: boolean;
  textSize3?: boolean;
  textSize4?: boolean;
  textSize5?: boolean;
  
  // Font family shortcuts
  fontOne?: boolean;
  fontTwo?: boolean;
  fontThree?: boolean;
  fontFour?: boolean;
  fontFive?: boolean;
  
  // Font weight shortcuts
  weight1?: boolean;
  weight2?: boolean;
  weight3?: boolean;
  weight4?: boolean;
  weight5?: boolean;
  weight6?: boolean;
  weight7?: boolean;
  
  // Text transform shortcuts
  textNone?: boolean;
  textUppercase?: boolean;
  textLowercase?: boolean;
  textCapitalize?: boolean;
  
  // Line height shortcuts
  leading1?: boolean;
  leading2?: boolean;
  leading3?: boolean;
  leading4?: boolean;
  
  // Letter spacing shortcuts
  spacing1?: boolean;
  spacing2?: boolean;
  spacing3?: boolean;
  spacing4?: boolean;
  spacing5?: boolean;
  
  // Typography preset shortcuts
  textHeading?: boolean;
  textBody?: boolean;
  textCaption?: boolean;
  textLabel?: boolean;
  textCode?: boolean;
}

export const typographyClass: ClassBuilderDef<TypographyShortcuts> = {
  props: {
    'fontSize': ifBy,
    'fontFamily': ifBy,
    'fontWeight': ifBy,
    'textTransform': ifBy,
    'lineHeight': ifBy,
    'letterSpacing': ifBy,
    'typography': ifBy,
    
    // Font size shortcuts
    'textSize1': ifSet({ fontSize: { size: 1 } }),
    'textSize2': ifSet({ fontSize: { size: 2 } }),
    'textSize3': ifSet({ fontSize: { size: 3 } }),
    'textSize4': ifSet({ fontSize: { size: 4 } }),
    'textSize5': ifSet({ fontSize: { size: 5 } }),
    
    // Font family shortcuts
    'fontOne': ifSet({ fontFamily: { family: 'one' } }),
    'fontTwo': ifSet({ fontFamily: { family: 'two' } }),
    'fontThree': ifSet({ fontFamily: { family: 'three' } }),
    'fontFour': ifSet({ fontFamily: { family: 'four' } }),
    'fontFive': ifSet({ fontFamily: { family: 'five' } }),
    
    // Font weight shortcuts
    'weight1': ifSet({ fontWeight: { weight: 1 } }),
    'weight2': ifSet({ fontWeight: { weight: 2 } }),
    'weight3': ifSet({ fontWeight: { weight: 3 } }),
    'weight4': ifSet({ fontWeight: { weight: 4 } }),
    'weight5': ifSet({ fontWeight: { weight: 5 } }),
    'weight6': ifSet({ fontWeight: { weight: 6 } }),
    'weight7': ifSet({ fontWeight: { weight: 7 } }),
    
    // Text transform shortcuts
    'textNone': ifSet({ textTransform: { transform: 'none' } }),
    'textUppercase': ifSet({ textTransform: { transform: 'uppercase' } }),
    'textLowercase': ifSet({ textTransform: { transform: 'lowercase' } }),
    'textCapitalize': ifSet({ textTransform: { transform: 'capitalize' } }),
    
    // Line height shortcuts
    'leading1': ifSet({ lineHeight: { leading: 1 } }),
    'leading2': ifSet({ lineHeight: { leading: 2 } }),
    'leading3': ifSet({ lineHeight: { leading: 3 } }),
    'leading4': ifSet({ lineHeight: { leading: 4 } }),
    
    // Letter spacing shortcuts
    'spacing1': ifSet({ letterSpacing: { spacing: 1 } }),
    'spacing2': ifSet({ letterSpacing: { spacing: 2 } }),
    'spacing3': ifSet({ letterSpacing: { spacing: 3 } }),
    'spacing4': ifSet({ letterSpacing: { spacing: 4 } }),
    'spacing5': ifSet({ letterSpacing: { spacing: 5 } }),
    
    // Typography preset shortcuts
    'textHeading': ifSet({ typography: { preset: 'heading' } }),
    'textBody': ifSet({ typography: { preset: 'body' } }),
    'textCaption': ifSet({ typography: { preset: 'caption' } }),
    'textLabel': ifSet({ typography: { preset: 'label' } }),
    'textCode': ifSet({ typography: { preset: 'code' } })
  },
  process: (sets: TypographyShortcuts[]): string => {
    const classes: string[] = [];
    
    // Merge todas as configurações
    const mergedProps: TypographyShortcuts = {};
    for (const set of sets) {
      Object.assign(mergedProps, set);
    }
    
    // Process font size
    if (mergedProps.fontSize?.size) {
      classes.push(`text-size${mergedProps.fontSize.size}`);
    }
    
    // Process font family
    if (mergedProps.fontFamily?.family) {
      classes.push(`font-${mergedProps.fontFamily.family}`);
    }
    
    // Process font weight
    if (mergedProps.fontWeight?.weight) {
      classes.push(`weight${mergedProps.fontWeight.weight}`);
    }
    
    // Process text transform
    if (mergedProps.textTransform?.transform) {
      classes.push(`text-${mergedProps.textTransform.transform}`);
    }
    
    // Process line height
    if (mergedProps.lineHeight?.leading) {
      classes.push(`leading${mergedProps.lineHeight.leading}`);
    }
    
    // Process letter spacing
    if (mergedProps.letterSpacing?.spacing) {
      classes.push(`spacing${mergedProps.letterSpacing.spacing}`);
    }
    
    // Process typography preset
    if (mergedProps.typography?.preset) {
      classes.push(`text-${mergedProps.typography.preset}`);
    }
    
    return classes.join(' ');
  }
};
