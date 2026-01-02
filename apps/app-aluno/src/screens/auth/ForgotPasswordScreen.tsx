import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { tokens } from '@/theme/tokens';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSend = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1000);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={tokens.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.title}>Recuperar senha</Text>
            </View>

            <View style={styles.form}>
                {!sent ? (
                    <>
                        <Text style={styles.description}>Digite seu e-mail para receber o código de recuperação.</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Seu e-mail"
                            placeholderTextColor={tokens.colors.text.placeholder}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <TouchableOpacity style={[styles.button, !email && styles.buttonDisabled]} onPress={handleSend} disabled={loading || !email}>
                            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Enviar código</Text>}
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.successContainer}>
                        <Ionicons name="mail-unread" size={48} color={tokens.colors.text.primary} />
                        <Text style={styles.description}>Código enviado para {email}</Text>

                        {/* Inputs for code and new password could be added here */}

                        <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
                            <Text style={styles.buttonText}>Voltar para Login</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tokens.colors.background.primary,
        padding: tokens.spacing['4xl'],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: tokens.spacing['4xl'],
        gap: tokens.spacing.md,
    },
    backButton: {
        padding: tokens.spacing.xs,
    },
    title: {
        fontSize: tokens.typography.fontSize['xl'],
        fontWeight: '700',
        color: tokens.colors.text.primary,
    },
    form: {
        gap: tokens.spacing.lg,
    },
    description: {
        fontSize: tokens.typography.fontSize.base,
        color: tokens.colors.text.secondary,
        lineHeight: tokens.typography.lineHeight.normal * tokens.typography.fontSize.base,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: tokens.colors.border.secondary,
        borderRadius: tokens.radius.md,
        paddingHorizontal: tokens.spacing.md,
        color: tokens.colors.text.primary,
        backgroundColor: tokens.colors.background.secondary,
    },
    button: {
        height: 48,
        backgroundColor: tokens.colors.background.brandPrimary,
        borderRadius: tokens.radius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: tokens.spacing.md,
    },
    buttonDisabled: {
        backgroundColor: tokens.colors.background.disabled,
        opacity: 0.7,
    },
    buttonText: {
        color: tokens.colors.text.primaryOnBrand,
        fontWeight: '600',
        fontSize: tokens.typography.fontSize.base,
    },
    successContainer: {
        alignItems: 'center',
        gap: tokens.spacing.lg,
        marginTop: tokens.spacing['4xl'],
    },
});
