import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '@/theme/tokens';

export default function AuthSuccessScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Ionicons name="checkmark-circle" size={80} color={tokens.colors.text.success} />
                <Text style={styles.title}>Tudo certo! 🎉</Text>
                <Text style={styles.message}>Sua conta foi criada com sucesso. Bora começar?</Text>

                <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={() => router.replace('/(tabs)/home')}
                >
                    <Text style={styles.buttonPrimaryText}>Começar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonSecondary}
                    onPress={() => router.replace('/login')}
                >
                    <Text style={styles.buttonSecondaryText}>Ir para login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tokens.colors.background.primary,
        justifyContent: 'center',
        padding: tokens.spacing['4xl'],
    },
    content: {
        alignItems: 'center',
        gap: tokens.spacing.md,
    },
    title: {
        fontSize: tokens.typography.fontSize['3xl'],
        fontWeight: '700',
        color: tokens.colors.text.primary,
        textAlign: 'center',
        marginTop: tokens.spacing.lg,
    },
    message: {
        fontSize: tokens.typography.fontSize.lg,
        color: tokens.colors.text.secondary,
        textAlign: 'center',
        marginBottom: tokens.spacing['4xl'],
    },
    buttonPrimary: {
        width: '100%',
        height: 56,
        backgroundColor: tokens.colors.background.brandPrimary,
        borderRadius: tokens.radius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonPrimaryText: {
        color: tokens.colors.text.primaryOnBrand,
        fontWeight: '600',
        fontSize: tokens.typography.fontSize.lg,
    },
    buttonSecondary: {
        width: '100%',
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonSecondaryText: {
        color: tokens.colors.text.primary,
        fontWeight: '500',
        fontSize: tokens.typography.fontSize.base,
    },
});
