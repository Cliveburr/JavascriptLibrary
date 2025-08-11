import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginResponse, RegisterResponse } from '../types/frontend';
import { useMemoryStore } from './memory.store';
import { createApiUrl } from '../config/api';

interface User {
    id: string;
    username?: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (credentials: { email: string; password: string; }) => Promise<void>;
    register: (data: { username: string; email: string; password: string; }) => Promise<void>;
    logout: () => void;
    setAuth: (data: LoginResponse | RegisterResponse) => void;
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
                    const response = await fetch(createApiUrl('/auth/login'), {
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

            register: async (registerData) => {
                try {
                    const response = await fetch(createApiUrl('/auth/register'), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(registerData),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Registration failed');
                    }

                    const data: RegisterResponse = await response.json();
                    get().setAuth(data);
                    // Adiciona a memória criada e seleciona
                    const memoryStore = useMemoryStore.getState();
                    memoryStore.memories.push({ id: data.createdMemory.id, name: data.createdMemory.name });
                    memoryStore.setCurrentMemory(data.createdMemory.id);
                } catch (error) {
                    console.error('Register error:', error);
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

            setAuth: (data: LoginResponse | RegisterResponse) => {
                set({
                    user: data.user,
                    token: data.token,
                    refreshToken: data.refreshToken,
                    isAuthenticated: true,
                });
            }
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
