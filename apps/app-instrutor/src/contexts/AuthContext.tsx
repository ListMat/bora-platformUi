import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { trpc } from '@/lib/trpc';
import { Alert, Platform } from 'react-native';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'instructor';
    photo?: string | null;
    token?: string;
}

interface AuthContextData {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Storage helper que funciona em web e native
const storage = {
    async getItem(key: string): Promise<string | null> {
        if (Platform.OS === 'web') {
            return localStorage.getItem(key);
        }
        return await SecureStore.getItemAsync(key);
    },
    async setItem(key: string, value: string): Promise<void> {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, value);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    },
    async deleteItem(key: string): Promise<void> {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loginMutation = trpc.auth.login.useMutation();
    const logoutMutation = trpc.auth.logout.useMutation();

    useEffect(() => {
        const loadStorageData = async () => {
            try {
                const storedUser = await storage.getItem('bora.user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Failed to load user from storage', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStorageData();
    }, []);

    const login = async (email: string, pass: string) => {
        try {
            // MVP: Assuming trpc.auth.login returns { user, token }
            // If backend is not ready, we can simulate:
            // const response = await loginMutation.mutateAsync({ email, password: pass });

            // SIMULATION for MVP until backend is connected:
            if (email === 'fail') throw new Error('Falha simulada');

            // Mock response - determina role baseado no email
            const role = email.includes('instrutor') ? 'instructor' : 'student';
            const name = email.includes('instrutor') ? 'Instrutor Mestre' : 'Aluno Teste Completo';

            const mockUser: User = {
                id: email.includes('instrutor') ? '2' : '1',
                name,
                email,
                role,
                photo: null,
                token: 'mock-jwt-token'
            };

            setUser(mockUser);
            await storage.setItem('bora.user', JSON.stringify(mockUser));
            if (mockUser.token) {
                await storage.setItem('auth_token', mockUser.token);
            }

            // Call API (will fail if route doesn't exist yet, so keeping commented or try/catch silent)
            // await loginMutation.mutateAsync({ email, password: pass });

        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // await logoutMutation.mutateAsync();
        } catch (e) {
            // ignore
        }
        setUser(null);
        await storage.deleteItem('bora.user');
        await storage.deleteItem('auth_token');
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
