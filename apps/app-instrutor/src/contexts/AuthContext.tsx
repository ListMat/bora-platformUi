import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { trpc } from '@/lib/trpc';
import { Alert } from 'react-native';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loginMutation = trpc.auth.login.useMutation();
    const logoutMutation = trpc.auth.logout.useMutation();

    useEffect(() => {
        const loadStorageData = async () => {
            try {
                const storedUser = await SecureStore.getItemAsync('bora.user');
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

            // Mock response
            const mockUser: User = {
                id: '1',
                name: 'Usuário Teste',
                email,
                role: 'student', // or dynamic based on app?
                photo: null,
                token: 'mock-jwt-token'
            };

            setUser(mockUser);
            await SecureStore.setItemAsync('bora.user', JSON.stringify(mockUser));
            if (mockUser.token) {
                await SecureStore.setItemAsync('auth_token', mockUser.token);
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
        await SecureStore.deleteItemAsync('bora.user');
        await SecureStore.deleteItemAsync('auth_token');
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
