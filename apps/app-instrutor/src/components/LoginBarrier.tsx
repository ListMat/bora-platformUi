import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { tokens } from '@/theme/tokens';
import * as Haptics from 'expo-haptics';

export function LoginBarrier() {
    const router = useRouter();

    const handlePress = (route: string) => {
        if (Platform.OS !== 'web') {
            try { Haptics.selectionAsync(); } catch (e) { }
        }
        router.push(route as any);
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name="lock-closed" size={32} color={tokens.colors.text.secondary} />
            </View>
            <Text style={styles.title}>Entre para agendar</Text>
            <Text style={styles.subtitle}>Só leva 1 minuto.</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={() => handlePress('/login')}
                    accessibilityLabel="Entrar"
                    accessibilityRole="button"
                >
                    <Text style={styles.buttonPrimaryText}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonSecondary}
                    onPress={() => handlePress('/register')}
                    accessibilityLabel="Criar conta"
                    accessibilityRole="button"
                >
                    <Text style={styles.buttonSecondaryText}>Criar conta</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: tokens.colors.background.secondary,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing['2xl'],
        alignItems: 'center',
        borderWidth: 1,
        borderColor: tokens.colors.border.secondary,
        margin: tokens.spacing.md,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: tokens.colors.background.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: tokens.spacing.md,
    },
    title: {
        fontSize: tokens.typography.fontSize.lg,
        fontWeight: '700',
        color: tokens.colors.text.primary,
        marginBottom: tokens.spacing.xs,
    },
    subtitle: {
        fontSize: tokens.typography.fontSize.sm,
        color: tokens.colors.text.secondary,
        marginBottom: tokens.spacing.xl,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: tokens.spacing.md,
        width: '100%',
    },
    buttonPrimary: {
        flex: 1,
        height: 44,
        backgroundColor: tokens.colors.background.brandPrimary,
        borderRadius: tokens.radius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonPrimaryText: {
        color: tokens.colors.text.primaryOnBrand,
        fontWeight: '600',
        fontSize: tokens.typography.fontSize.sm,
    },
    buttonSecondary: {
        flex: 1,
        height: 44,
        backgroundColor: 'transparent',
        borderRadius: tokens.radius.md,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: tokens.colors.border.brand,
    },
    buttonSecondaryText: {
        color: tokens.colors.text.brandPrimary,
        fontWeight: '600',
        fontSize: tokens.typography.fontSize.sm,
    },
});
