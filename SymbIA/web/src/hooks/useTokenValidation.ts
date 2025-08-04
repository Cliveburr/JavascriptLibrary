import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { createApiUrl } from '../config/api';

interface TokenValidationState {
    isValidating: boolean;
    isValid: boolean | null;
}

/**
 * Hook para validar token na inicialização da aplicação
 */
export const useTokenValidation = (): TokenValidationState => {
    const { token, refreshToken, logout, setAuth } = useAuthStore();
    const [state, setState] = useState<TokenValidationState>({
        isValidating: false,
        isValid: null
    });

    useEffect(() => {
        const tryRefreshToken = async (): Promise<boolean> => {
            if (!refreshToken) {
                return false;
            }

            try {
                const response = await fetch(createApiUrl('/auth/refresh'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setAuth(data);
                    return true;
                }
            } catch (error) {
                console.warn('Erro ao fazer refresh do token:', error);
            }

            return false;
        };

        const validateToken = async () => {
            // Se não há token, não há nada para validar
            if (!token) {
                setState({ isValidating: false, isValid: true });
                return;
            }

            setState({ isValidating: true, isValid: null });

            try {
                // Tentar fazer uma chamada simples para verificar se o token é válido
                const response = await fetch(createApiUrl('/auth/validate'), {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    // Token inválido, tentar refresh
                    console.warn('Token inválido detectado, tentando fazer refresh...');

                    const refreshSuccess = await tryRefreshToken();

                    if (!refreshSuccess) {
                        // Refresh falhou, fazer logout
                        console.warn('Refresh do token falhou, fazendo logout...');
                        logout();
                        setState({ isValidating: false, isValid: false });
                    } else {
                        // Refresh sucesso
                        console.log('Token refreshed com sucesso');
                        setState({ isValidating: false, isValid: true });
                    }
                } else {
                    // Token válido
                    setState({ isValidating: false, isValid: true });
                }
            } catch (error) {
                // Erro de rede - tentar refresh antes de fazer logout
                console.warn('Erro ao validar token, tentando refresh...', error);

                const refreshSuccess = await tryRefreshToken();

                if (!refreshSuccess) {
                    logout();
                    setState({ isValidating: false, isValid: false });
                } else {
                    setState({ isValidating: false, isValid: true });
                }
            }
        };

        validateToken();
    }, [token, refreshToken, logout, setAuth]); // Dependências necessárias

    return state;
};
