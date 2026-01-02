import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Switch,
    Image,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { z } from 'zod';
import { tokens } from '@/theme/tokens';
import * as Haptics from 'expo-haptics';

// Masks
const maskCPF = (v: string) => {
    return v
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '-$1')
        .replace(/(-\d{2})\d+?$/, '$1');
};

const maskPhone = (v: string) => {
    return v
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
};

// Schemas
const step1Schema = z.object({
    name: z.string().min(3, 'Nome muito curto'),
    cpf: z.string().min(14, 'CPF inválido'),
    email: z.string().email('E-mail inválido'),
    phone: z.string().min(14, 'Telefone inválido'),
});

const step2Schema = z.object({
    password: z.string().min(8, 'Mínimo 8 caracteres').regex(/[A-Z]/, 'Precisa de 1 maiúscula').regex(/[0-9]/, 'Precisa de 1 número'),
    confirmPassword: z.string(),
    lgpd: z.literal(true, { errorMap: () => ({ message: 'Aceite os termos' }) }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
});

export default function RegisterScreen() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        name: '',
        cpf: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        lgpd: false,
        photo: null as string | null,
        role: 'student',
        hasVehicle: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPass, setShowPass] = useState(false);

    const updateData = (key: string, value: any) => {
        setData((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const handleNext = async () => {
        let schema;
        if (step === 1) schema = step1Schema;
        if (step === 2) schema = step2Schema;

        if (schema) {
            const result = schema.safeParse(data);
            if (!result.success) {
                const newErrors: Record<string, string> = {};
                result.error.errors.forEach((err) => {
                    if (err.path[0]) newErrors[err.path[0] as string] = err.message;
                });
                setErrors(newErrors);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                return;
            }
        }

        if (step < 3) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            updateData('photo', result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!data.photo && step === 3) {
            // Photo optional logic if needed
        }

        setLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Simulate API
        setTimeout(() => {
            setLoading(false);
            // Logic for next screen
            if (data.role === 'instructor' || (data.role === 'student' && data.hasVehicle)) {
                // Pass role to next screen to enforce validation logic
                router.push(`/register/vehicle?role=${data.role}`);
            } else {
                router.replace('/success');
            }
        }, 1500);
    };

    const renderStep1 = () => (
        <View style={styles.form}>
            <View>
                <Text style={styles.label}>Nome completo</Text>
                <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="Ex: João Silva"
                    placeholderTextColor={tokens.colors.text.placeholder}
                    value={data.name}
                    onChangeText={(t) => updateData('name', t)}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>
            <View>
                <Text style={styles.label}>CPF</Text>
                <TextInput
                    style={[styles.input, errors.cpf && styles.inputError]}
                    placeholder="000.000.000-00"
                    placeholderTextColor={tokens.colors.text.placeholder}
                    value={data.cpf}
                    onChangeText={(t) => updateData('cpf', maskCPF(t))}
                    keyboardType="numeric"
                    maxLength={14}
                />
                {errors.cpf && <Text style={styles.errorText}>{errors.cpf}</Text>}
            </View>
            <View>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="Ex: joao@email.com"
                    placeholderTextColor={tokens.colors.text.placeholder}
                    value={data.email}
                    onChangeText={(t) => updateData('email', t)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>
            <View>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                    style={[styles.input, errors.phone && styles.inputError]}
                    placeholder="(00) 00000-0000"
                    placeholderTextColor={tokens.colors.text.placeholder}
                    value={data.phone}
                    onChangeText={(t) => updateData('phone', maskPhone(t))}
                    keyboardType="phone-pad"
                    maxLength={15}
                />
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.form}>
            <View>
                <Text style={styles.label}>Senha</Text>
                <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                    <TextInput
                        style={styles.inputFlex}
                        placeholder="Mínimo 8 caracteres"
                        placeholderTextColor={tokens.colors.text.placeholder}
                        value={data.password}
                        onChangeText={(t) => updateData('password', t)}
                        secureTextEntry={!showPass}
                    />
                    <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                        <Ionicons name={showPass ? 'eye-off' : 'eye'} size={20} color={tokens.colors.text.secondary} />
                    </TouchableOpacity>
                </View>
                {errors.password ? (
                    <Text style={styles.errorText}>{errors.password}</Text>
                ) : (
                    <Text style={styles.helperText}>Mínimo 8 caracteres, 1 maiúscula, 1 número.</Text>
                )}
            </View>
            <View>
                <Text style={styles.label}>Confirme a senha</Text>
                <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                    <TextInput
                        style={styles.inputFlex}
                        placeholder="Repita a senha"
                        placeholderTextColor={tokens.colors.text.placeholder}
                        value={data.confirmPassword}
                        onChangeText={(t) => updateData('confirmPassword', t)}
                        secureTextEntry={!showPass}
                    />
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>
            <View style={styles.checkboxContainer}>
                <Switch
                    value={data.lgpd}
                    onValueChange={(v) => updateData('lgpd', v)}
                    trackColor={{ false: tokens.colors.background.secondary, true: tokens.colors.background.brandPrimary }}
                />
                <Text style={styles.checkboxLabel}>
                    Li e concordo com os <Text style={styles.link}>Termos de Uso</Text> e <Text style={styles.link}>Política de Privacidade</Text>.
                </Text>
            </View>
            {errors.lgpd && <Text style={styles.errorText}>{errors.lgpd}</Text>}
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.form}>
            <View style={styles.photoContainer}>
                <TouchableOpacity onPress={pickImage} style={styles.photoButton}>
                    {data.photo ? (
                        <Image source={{ uri: data.photo }} style={styles.photo} />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <Ionicons name="camera" size={32} color={tokens.colors.text.secondary} />
                            <Text style={styles.photoText}>Adicionar foto</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <Text style={styles.helperText}>Foto de perfil (Obrigatório)</Text>
            </View>

            <View>
                <Text style={styles.label}>Eu sou:</Text>
                <View style={styles.roleSelector}>
                    <TouchableOpacity
                        style={[styles.roleOption, data.role === 'student' && styles.roleOptionActive]}
                        onPress={() => updateData('role', 'student')}
                    >
                        <Ionicons name="school" size={24} color={data.role === 'student' ? tokens.colors.text.white : tokens.colors.text.secondary} />
                        <Text style={[styles.roleText, data.role === 'student' && styles.roleTextActive]}>Aluno</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.roleOption, data.role === 'instructor' && styles.roleOptionActive]}
                        onPress={() => {
                            updateData('role', 'instructor');
                            updateData('hasVehicle', true); // Instructors implies vehicle logic
                        }}
                    >
                        <Ionicons name="car" size={24} color={data.role === 'instructor' ? tokens.colors.text.white : tokens.colors.text.secondary} />
                        <Text style={[styles.roleText, data.role === 'instructor' && styles.roleTextActive]}>Instrutor</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {data.role === 'student' && (
                <View style={styles.switchContainer}>
                    <Text style={styles.label}>Tenho carro próprio para aula</Text>
                    <Switch
                        value={data.hasVehicle}
                        onValueChange={(v) => updateData('hasVehicle', v)}
                        trackColor={{ false: tokens.colors.background.secondary, true: tokens.colors.background.brandPrimary }}
                    />
                </View>
            )}
        </View>
    );

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={tokens.colors.text.primary} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.title}>Criar conta</Text>
                    <Text style={styles.stepIndicator}>Passo {step} de 3</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={handleNext}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color={tokens.colors.text.primaryOnBrand} /> : <Text style={styles.buttonPrimaryText}>{step === 3 ? 'Criar conta' : 'Próximo'}</Text>}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tokens.colors.background.primary,
    },
    scrollContent: {
        padding: tokens.spacing['4xl'],
    },
    header: {
        paddingTop: 60, // Safe area approx
        paddingHorizontal: tokens.spacing['4xl'],
        paddingBottom: tokens.spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: tokens.spacing.lg,
        backgroundColor: tokens.colors.background.primary,
    },
    backButton: {
        padding: tokens.spacing.xs,
    },
    title: {
        fontSize: tokens.typography.fontSize['xl'],
        fontWeight: '700',
        color: tokens.colors.text.primary,
    },
    stepIndicator: {
        fontSize: tokens.typography.fontSize.sm,
        color: tokens.colors.text.secondary,
    },
    form: {
        gap: tokens.spacing.lg,
    },
    label: {
        fontSize: tokens.typography.fontSize.sm,
        fontWeight: '500',
        color: tokens.colors.text.secondary,
        marginBottom: tokens.spacing.xs,
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
    errorText: {
        color: tokens.colors.text.error,
        fontSize: tokens.typography.fontSize.xs,
        marginTop: 4,
    },
    helperText: {
        color: tokens.colors.text.tertiary,
        fontSize: tokens.typography.fontSize.xs,
        marginTop: 4,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: tokens.spacing.md,
    },
    checkboxLabel: {
        flex: 1,
        color: tokens.colors.text.secondary,
        fontSize: tokens.typography.fontSize.sm,
    },
    link: {
        color: tokens.colors.text.primary,
        fontWeight: '600',
    },
    photoContainer: {
        alignItems: 'center',
        gap: tokens.spacing.sm,
        marginBottom: tokens.spacing.md,
    },
    photoButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: tokens.colors.background.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: tokens.colors.border.secondary,
        overflow: 'hidden',
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    photoPlaceholder: {
        alignItems: 'center',
        gap: 4,
    },
    photoText: {
        color: tokens.colors.text.secondary,
        fontSize: tokens.typography.fontSize.xs,
    },
    roleSelector: {
        flexDirection: 'row',
        gap: tokens.spacing.md,
    },
    roleOption: {
        flex: 1,
        height: 80,
        backgroundColor: tokens.colors.background.secondary,
        borderRadius: tokens.radius.md,
        borderWidth: 1,
        borderColor: tokens.colors.border.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        gap: tokens.spacing.xs,
    },
    roleOptionActive: {
        backgroundColor: tokens.colors.background.brandPrimary,
        borderColor: tokens.colors.background.brandPrimary,
    },
    roleText: {
        color: tokens.colors.text.secondary,
        fontWeight: '500',
    },
    roleTextActive: {
        color: tokens.colors.text.white,
        fontWeight: '700',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: tokens.spacing.md,
    },
    footer: {
        padding: tokens.spacing['4xl'],
        backgroundColor: tokens.colors.background.primary,
        borderTopWidth: 1,
        borderColor: tokens.colors.border.secondary,
    },
    buttonPrimary: {
        height: 48,
        backgroundColor: tokens.colors.background.brandPrimary,
        borderRadius: tokens.radius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonPrimaryText: {
        color: tokens.colors.text.primaryOnBrand,
        fontWeight: '600',
        fontSize: tokens.typography.fontSize.base,
    },
});
