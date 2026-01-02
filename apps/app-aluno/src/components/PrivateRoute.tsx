import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LoginBarrier } from './LoginBarrier';

interface PrivateRouteProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    redirectToLogin?: boolean;
}

export function PrivateRoute({ children, fallback, redirectToLogin = false }: PrivateRouteProps) {
    const { isLoggedIn, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (!isLoading && !isLoggedIn && redirectToLogin) {
            setIsRedirecting(true);
            // Replace allows going back? Usually replace is better for auth redirects to avoid back loop.
            // Pass redirect param for return.
            router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
    }, [isLoading, isLoggedIn, redirectToLogin, pathname]);

    if (isLoading || isRedirecting) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!isLoggedIn) {
        if (redirectToLogin) return null; // Render nothing while effect triggers redirect
        return <>{fallback || <LoginBarrier />}</>;
    }

    return <>{children}</>;
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
