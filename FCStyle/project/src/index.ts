
// Export components
export * from './grid';
export * from './components';
export * from './form';
export * from './helpers';
export * from './validator';

// Export a function to apply custom theme variables
export const applyTheme = (themeVariables: Record<string, string>) => {
  const root = document.documentElement;
  
  Object.entries(themeVariables).forEach(([property, value]) => {
    // Ensure the property starts with --fcstyle- for safety
    root.style.setProperty(property, value);
  });
};

// Export default theme variables for reference
export const defaultTheme = {
};
