import { ClassBuilderDef, ifBy, ifSet } from "./classBuilder";

export interface TransitionSet {
  transition?: 1 | 2 | 3 | 4 | 5 | 'transform' | 'colors' | 'focus' | 'filter';
}

export interface ShadowSet {
  shadow?: 1 | 2 | 3 | 4 | 5 | 'none' | 'success' | 'error' | 'warning';
}

export interface FocusShadowSet {
  focusShadow?: 1 | 2 | 3;
}

export interface FilterSet {
  filter?: 'brightness-hover' | 'brightness-active' | 'brightness-disabled' | 'blur' | 'grayscale' | 'none';
}

export interface EffectPresetSet {
  preset?: 'card' | 'button' | 'input' | 'modal';
}

export interface HoverEffectSet {
  hover?: 'shadow' | 'shadow-large' | 'brightness' | 'lift';
}

export interface ActiveEffectSet {
  active?: 'brightness' | 'scale';
}

export interface EffectsShortcuts {
  // Effect sets
  transition?: TransitionSet;
  shadow?: ShadowSet;
  focusShadow?: FocusShadowSet;
  filter?: FilterSet;
  effects?: EffectPresetSet;
  hover?: HoverEffectSet;
  active?: ActiveEffectSet;
  
  // Transition shortcuts
  transition1?: boolean;
  transition2?: boolean;
  transition3?: boolean;
  transition4?: boolean;
  transition5?: boolean;
  transitionTransform?: boolean;
  transitionColors?: boolean;
  transitionFocus?: boolean;
  transitionFilter?: boolean;
  
  // Shadow shortcuts
  shadow1?: boolean;
  shadow2?: boolean;
  sh3?: boolean;
  shadow4?: boolean;
  shadow5?: boolean;
  shadowNone?: boolean;
  shadowSuccess?: boolean;
  shadowError?: boolean;
  shadowWarning?: boolean;
  
  // Focus shadow shortcuts
  focusShadow1?: boolean;
  focusShadow2?: boolean;
  focusShadow3?: boolean;
  
  // Filter shortcuts
  filterBrightnessHover?: boolean;
  filterBrightnessActive?: boolean;
  filterBrightnessDisabled?: boolean;
  filterBlur?: boolean;
  filterGrayscale?: boolean;
  filterNone?: boolean;
  
  // Hover effects
  hoverShadow?: boolean;
  hoverShadowLarge?: boolean;
  hoverBrightness?: boolean;
  hoverLift?: boolean;
  
  // Active effects
  activeBrightness?: boolean;
  activeScale?: boolean;
  
  // Disabled effects
  disabledEffects?: boolean;
  
  // Effect presets
  effectCard?: boolean;
  effectButton?: boolean;
  effectInput?: boolean;
  effectModal?: boolean;
}

export const EffectsBuilder: ClassBuilderDef<EffectsShortcuts> = {
  props: {
    'transition': ifBy,
    'shadow': ifBy,
    'focusShadow': ifBy,
    'filter': ifBy,
    'effects': ifBy,
    'hover': ifBy,
    'active': ifBy,
    
    // Transition shortcuts
    'transition1': ifSet({ transition: { transition: 1 } }),
    'transition2': ifSet({ transition: { transition: 2 } }),
    'transition3': ifSet({ transition: { transition: 3 } }),
    'transition4': ifSet({ transition: { transition: 4 } }),
    'transition5': ifSet({ transition: { transition: 5 } }),
    'transitionTransform': ifSet({ transition: { transition: 'transform' } }),
    'transitionColors': ifSet({ transition: { transition: 'colors' } }),
    'transitionFocus': ifSet({ transition: { transition: 'focus' } }),
    'transitionFilter': ifSet({ transition: { transition: 'filter' } }),
    
    // Shadow shortcuts
    'shadow1': ifSet({ shadow: { shadow: 1 } }),
    'shadow2': ifSet({ shadow: { shadow: 2 } }),
    'sh3': ifSet({ shadow: { shadow: 3 } }),
    'shadow4': ifSet({ shadow: { shadow: 4 } }),
    'shadow5': ifSet({ shadow: { shadow: 5 } }),
    'shadowNone': ifSet({ shadow: { shadow: 'none' } }),
    'shadowSuccess': ifSet({ shadow: { shadow: 'success' } }),
    'shadowError': ifSet({ shadow: { shadow: 'error' } }),
    'shadowWarning': ifSet({ shadow: { shadow: 'warning' } }),
    
    // Focus shadow shortcuts
    'focusShadow1': ifSet({ focusShadow: { focusShadow: 1 } }),
    'focusShadow2': ifSet({ focusShadow: { focusShadow: 2 } }),
    'focusShadow3': ifSet({ focusShadow: { focusShadow: 3 } }),
    
    // Filter shortcuts
    'filterBrightnessHover': ifSet({ filter: { filter: 'brightness-hover' } }),
    'filterBrightnessActive': ifSet({ filter: { filter: 'brightness-active' } }),
    'filterBrightnessDisabled': ifSet({ filter: { filter: 'brightness-disabled' } }),
    'filterBlur': ifSet({ filter: { filter: 'blur' } }),
    'filterGrayscale': ifSet({ filter: { filter: 'grayscale' } }),
    'filterNone': ifSet({ filter: { filter: 'none' } }),
    
    // Hover effects
    'hoverShadow': ifSet({ hover: { hover: 'shadow' } }),
    'hoverShadowLarge': ifSet({ hover: { hover: 'shadow-large' } }),
    'hoverBrightness': ifSet({ hover: { hover: 'brightness' } }),
    'hoverLift': ifSet({ hover: { hover: 'lift' } }),
    
    // Active effects
    'activeBrightness': ifSet({ active: { active: 'brightness' } }),
    'activeScale': ifSet({ active: { active: 'scale' } }),
    
    // Disabled effects
    'disabledEffects': ifSet({ filter: { filter: 'brightness-disabled' } }),
    
    // Effect presets
    'effectCard': ifSet({ effects: { preset: 'card' } }),
    'effectButton': ifSet({ effects: { preset: 'button' } }),
    'effectInput': ifSet({ effects: { preset: 'input' } }),
    'effectModal': ifSet({ effects: { preset: 'modal' } })
  },
  process: (sets: EffectsShortcuts[]): string => {
    const classes: string[] = [];
    
    // Merge todas as configurações
    const mergedProps: EffectsShortcuts = {};
    for (const set of sets) {
      Object.assign(mergedProps, set);
    }
    
    // Process transition
    if (mergedProps.transition?.transition) {
      const t = mergedProps.transition.transition;
      if (typeof t === 'number') {
        classes.push(`transition${t}`);
      } else {
        classes.push(`transition-${t}`);
      }
    }
    
    // Process shadow
    if (mergedProps.shadow?.shadow) {
      const s = mergedProps.shadow.shadow;
      if (typeof s === 'number') {
        classes.push(`shadow${s}`);
      } else if (s === 'none') {
        classes.push('shadow-none');
      } else {
        classes.push(`shadow-${s}`);
      }
    }
    
    // Process focus shadow
    if (mergedProps.focusShadow?.focusShadow) {
      classes.push(`focus-shadow${mergedProps.focusShadow.focusShadow}`);
    }
    
    // Process filter
    if (mergedProps.filter?.filter) {
      const f = mergedProps.filter.filter;
      if (f === 'none') {
        classes.push('filter-none');
      } else {
        classes.push(`filter-${f}`);
      }
    }
    
    // Process hover effects
    if (mergedProps.hover?.hover) {
      classes.push(`hover-${mergedProps.hover.hover}`);
    }
    
    // Process active effects
    if (mergedProps.active?.active) {
      classes.push(`active-${mergedProps.active.active}`);
    }
    
    // Process effect presets
    if (mergedProps.effects?.preset) {
      classes.push(`effect-${mergedProps.effects.preset}`);
    }
    
    return classes.join(' ');
  }
};
