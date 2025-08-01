// API Configuration
export const API_CONFIG = {
    BASE_URL: 'http://localhost:3002',
} as const;

// Helper function to create API URLs
export const createApiUrl = (path: string): string => {
    return `${API_CONFIG.BASE_URL}${path}`;
};
