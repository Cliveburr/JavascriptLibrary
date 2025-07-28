import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginResponse } from '@symbia/interfaces';

interface User {
    id: string;
    email: string;
    defaultMemoryId: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (credentials: { email: string; password: string; }) => Promise<void>;
    logout: () => void;
    setAuth: (data: LoginResponse) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,

            login: async (credentials) => {
                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(credentials),
                    });

                    if (!response.ok) {
                        throw new Error('Login failed');
                    }

                    const data: LoginResponse = await response.json();
                    get().setAuth(data);
                } catch (error) {
                    console.error('Login error:', error);
                    throw error;
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },

            setAuth: (data: LoginResponse) => {
                set({
                    user: data.user,
                    token: data.token,
                    refreshToken: data.refreshToken,
                    isAuthenticated: true,
                });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
