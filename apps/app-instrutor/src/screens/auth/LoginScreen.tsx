import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { YStack, XStack, Text, ScrollView, useTheme } from 'tamagui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
    const theme = useTheme();

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
                router.replace('/(tabs)');
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
            style={{ flex: 1, backgroundColor: theme.background.val }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 32 }}>
                    <YStack ai="center" mb="$10">
                        <Text fontSize="$9" fontWeight="900" color="$primary" mb="$2">BORA</Text>
                        <Text fontSize="$6" fontWeight="700" color="$color">Entrar</Text>
                    </YStack>

                    <YStack space="$4">
                        <YStack space="$2">
                            <Text fontSize="$3" fontWeight="500" color="$color" opacity={0.7}>E-mail</Text>
                            <Input
                                placeholder="Ex: joao@email.com"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </YStack>

                        <YStack space="$2">
                            <Text fontSize="$3" fontWeight="500" color="$color" opacity={0.7}>Senha</Text>
                            <XStack alignItems="center" w="100%">
                                <Input
                                    flex={1}
                                    placeholder="******"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <Button
                                    position="absolute"
                                    right={0}
                                    chromeless
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.color.val} />
                                </Button>
                            </XStack>
                            <Button
                                alignSelf="flex-end"
                                chromeless
                                size="$2"
                                onPress={() => router.push('/forgot-password')}
                                pressStyle={{ opacity: 0.7 }}
                                backgroundColor="transparent"
                            >
                                <Text color="$color" opacity={0.7} fontSize="$2">Esqueci minha senha</Text>
                            </Button>
                        </YStack>

                        {error && (
                            <XStack bg="$red3" p="$3" br="$3" ai="center" space="$2">
                                <Ionicons name="alert-circle" size={16} color="red" />
                                <Text color="red" fontSize="$3">{error}</Text>
                            </XStack>
                        )}

                        <Button
                            onPress={handleLogin}
                            disabled={loading || !email || !password}
                            opacity={(loading || !email || !password) ? 0.7 : 1}
                        >
                            {loading ? <ActivityIndicator color="white" /> : "Entrar"}
                        </Button>

                        <XStack ai="center" my="$4">
                            <Separator />
                            <Text mx="$3" color="$color" opacity={0.5}>ou</Text>
                            <Separator />
                        </XStack>

                        <Button variant="outline" onPress={() => { }}>
                            <XStack space="$2" ai="center">
                                <Ionicons name="logo-google" size={20} color={theme.color.val} />
                                <Text color="$color" fontWeight="500">Entrar com Google</Text>
                            </XStack>
                        </Button>

                        <XStack jc="center" mt="$6" space="$2" ai="center">
                            <Text color="$color" opacity={0.7}>Não tem conta?</Text>
                            <Button p={0} h="auto" chromeless onPress={() => router.push('/register')} backgroundColor="transparent">
                                <Text color="$primary" fontWeight="600">Criar conta</Text>
                            </Button>
                        </XStack>
                    </YStack>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const Separator = () => <YStack f={1} h={1} bg="$borderColor" />
