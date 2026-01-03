import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { tokens } from '@/theme/tokens';

export default function Index() {
    const { isLoggedIn, isLoading } = useAuth();

    // Mostra loading enquanto verifica autenticação
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: tokens.colors.background.primary }}>
                <ActivityIndicator size="large" color={tokens.colors.background.brandPrimary} />
            </View>
        );
    }

    // Se não estiver logado, redireciona para login
    if (!isLoggedIn) {
        return <Redirect href="/login" />;
    }

    // Se estiver logado, redireciona para tabs
    return <Redirect href="/(tabs)" />;
}
