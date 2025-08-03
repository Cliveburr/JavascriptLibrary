import { useCallback } from 'react';

export interface UseErrorReturn {
    handleError: (error: any, context?: string) => void;
}

export const useError = (): UseErrorReturn => {
    const handleError = useCallback((error: any, context?: string) => {
        const errorMessage = error?.message || error?.toString() || 'Erro desconhecido';
        const fullContext = context ? `[${context}]` : '[Erro]';

        console.error(`${fullContext} ${errorMessage}`, error);
    }, []);

    return {
        handleError
    };
};
