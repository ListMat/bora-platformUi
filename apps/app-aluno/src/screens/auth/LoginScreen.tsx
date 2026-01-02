import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { tokens } from '@/theme/tokens';

const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const { redirect } = useLocalSearchParams<{ redirect: string }>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setError(null);
        const validation = loginSchema.safeParse({ email, password });
        if (!validation.success) {
            setError(validation.error.errors[0].message);
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            if (redirect) {
                const target = Array.isArray(redirect) ? redirect[0] : redirect;
                router.replace(decodeURIComponent(target) as any);
            } else {
                router.replace('/(tabs)/home');
            }
        } catch (e: any) {
            setError(e.message || 'Falha ao entrar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.logo}>BORA</Text>
                        <Text style={styles.title}>Entrar</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>E-mail</Text>
                            <TextInput
                                style={[styles.input, error ? styles.inputError : undefined]}
                                placeholder="Ex: joao@email.com"
                                placeholderTextColor={tokens.colors.text.placeholder}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                accessibilityLabel="Campo de e-mail"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Senha</Text>
                            <View style={[styles.inputContainer, error ? styles.inputError : undefined]}>
                                <TextInput
                                    style={styles.inputFlex}
                                    placeholder="******"
                                    placeholderTextColor={tokens.colors.text.placeholder}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    accessibilityLabel="Campo de senha"
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={20}
                                        color={tokens.colors.text.secondary}
                                    />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                onPress={() => router.push('/forgot-password')}
                                style={styles.forgotPassContainer}
                            >
                                <Text style={styles.forgotPassText}>Esqueci minha senha</Text>
                            </TouchableOpacity>
                        </View>

                        {error && (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle" size={16} color={tokens.colors.text.error} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.buttonPrimary,
                                (loading || !email || !password) && styles.buttonDisabled,
                            ]}
                            onPress={handleLogin}
                            disabled={loading || !email || !password}
                        >
                            {loading ? (
                                <ActivityIndicator color={tokens.colors.text.primaryOnBrand} />
                            ) : (
                                <Text style={styles.buttonPrimaryText}>Entrar</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>ou</Text>
                            <View style={styles.line} />
                        </View>

                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-google" size={20} color={tokens.colors.text.primary} />
                            <Text style={styles.socialButtonText}>Entrar com Google</Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Não tem conta?</Text>
                            <TouchableOpacity onPress={() => router.push('/register')}>
                                <Text style={styles.footerLink}>Criar conta</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tokens.colors.background.primary,
    },
    scrollContent: {
        flexGrow: 1,
        padding: tokens.spacing['4xl'], // 32
        justifyContent: 'center',
    },
    header: {
        marginBottom: tokens.spacing['4xl'],
        alignItems: 'center',
    },
    logo: {
        fontSize: tokens.typography.fontSize['3xl'],
        fontWeight: '900',
        color: tokens.colors.background.brandPrimary,
        marginBottom: tokens.spacing.sm,
    },
    title: {
        fontSize: tokens.typography.fontSize['2xl'],
        fontWeight: '700',
        color: tokens.colors.text.primary,
    },
    form: {
        gap: tokens.spacing.lg,
    },
    inputGroup: {
        gap: tokens.spacing.xs,
    },
    label: {
        fontSize: tokens.typography.fontSize.sm,
        fontWeight: '500',
        color: tokens.colors.text.secondary,
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
    inputContainer: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: tokens.colors.border.secondary,
        borderRadius: tokens.radius.md,
        paddingHorizontal: tokens.spacing.md,
        backgroundColor: tokens.colors.background.secondary,
    },
    inputFlex: {
        flex: 1,
        height: '100%',
        color: tokens.colors.text.primary,
    },
    inputError: {
        borderColor: tokens.colors.border.error,
    },
    forgotPassContainer: {
        alignSelf: 'flex-end',
        marginTop: tokens.spacing.xs,
    },
    forgotPassText: {
        color: tokens.colors.text.secondary,
        fontSize: tokens.typography.fontSize.xs,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: tokens.spacing.xs,
        backgroundColor: 'rgba(240, 68, 56, 0.1)',
        padding: tokens.spacing.sm,
        borderRadius: tokens.radius.sm,
    },
    errorText: {
        color: tokens.colors.text.error,
        fontSize: tokens.typography.fontSize.sm,
    },
    buttonPrimary: {
        height: 48,
        backgroundColor: tokens.colors.background.brandPrimary,
        borderRadius: tokens.radius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: tokens.spacing.md,
    },
    buttonDisabled: {
        opacity: 0.7,
        backgroundColor: tokens.colors.background.disabled,
    },
    buttonPrimaryText: {
        color: tokens.colors.text.primaryOnBrand,
        fontWeight: '600',
        fontSize: tokens.typography.fontSize.base,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: tokens.spacing.lg,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: tokens.colors.border.secondary,
    },
    dividerText: {
        marginHorizontal: tokens.spacing.md,
        color: tokens.colors.text.tertiary,
        fontSize: tokens.typography.fontSize.sm,
    },
    socialButton: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: tokens.colors.border.secondary,
        borderRadius: tokens.radius.md,
        backgroundColor: tokens.colors.background.secondary,
        gap: tokens.spacing.md,
    },
    socialButtonText: {
        color: tokens.colors.text.primary,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: tokens.spacing['2xl'],
        gap: tokens.spacing.xs,
    },
    footerText: {
        color: tokens.colors.text.secondary,
    },
    footerLink: {
        color: tokens.colors.text.primary,
        fontWeight: '600',
    },
});
