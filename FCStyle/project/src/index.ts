// Import styles
import './styles/index.scss';

// Export components
export * from './grid';
export * from './components';
export * from './form';
export * from './validator';

// Export a function to apply custom theme variables
export const applyTheme = (themeVariables: Record<string, string>) => {
  const root = document.documentElement;
  
  Object.entries(themeVariables).forEach(([property, value]) => {
    // Ensure the property starts with --fcstyle- for safety
    if (property.startsWith('--fcstyle-')) {
      root.style.setProperty(property, value);
    }
  });
};

// Export default theme variables for reference
export const defaultTheme = {
  '--fcstyle-display-gap': '16px',
  '--fcstyle-button-primary-bg': '#007bff',
  '--fcstyle-button-primary-color': '#ffffff',
  '--fcstyle-button-primary-border': '1px solid #007bff',
  '--fcstyle-button-primary-hover-bg': '#0056b3',
  '--fcstyle-button-primary-hover-border': '1px solid #0056b3',
  '--fcstyle-button-second-bg': '#6c757d',
  '--fcstyle-button-second-color': '#ffffff',
  '--fcstyle-button-second-border': '1px solid #6c757d',
  '--fcstyle-button-second-hover-bg': '#545b62',
  '--fcstyle-button-second-hover-border': '1px solid #545b62',
  '--fcstyle-button-padding': '8px 16px',
  '--fcstyle-button-border-radius': '4px',
  '--fcstyle-button-font-size': '14px',
  '--fcstyle-button-font-weight': '400',
  '--fcstyle-button-transition': 'all 0.2s ease-in-out'
};
