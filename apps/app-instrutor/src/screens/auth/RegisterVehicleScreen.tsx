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
    ActivityIndicator,
    Modal
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { tokens } from '@/theme/tokens';
import MaskInput from 'react-native-mask-input';
import { useViaCep } from '@/hooks/useViaCep';
import * as Haptics from 'expo-haptics';

const years = Array.from({ length: 47 }, (_, i) => (2026 - i).toString());
const CEP_MASK = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

export default function RegisterVehicleScreen() {
    const router = useRouter();
    const { role } = useLocalSearchParams<{ role: string }>(); // 'student' or 'instructor'
    const isInstructor = role === 'instructor';
    const { fetchAddress, loading: loadingAddress } = useViaCep();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        photo: null as string | null,
        make: '',
        model: '',
        year: '',
        color: '',
        plate: '', // Last 4 digits
        motor: '',
        power: '',
        transmission: '',
        fuel: '',
        category: '',
        security: [] as string[],
        comfort: [] as string[],
        hasDoublePedal: false,
        doublePedalPhoto: null as string | null,
        acceptStudentCar: false,

        // Endereço da aula
        addressZip: '',
        addressStreet: '',
        addressNumber: '',
        addressComplement: '',
        addressNeighborhood: '',
        addressCity: '',
        addressState: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateData = (key: string, value: any) => {
        setData(prev => ({ ...prev, [key]: value }));
        if (errors[key]) {
            const n = { ...errors };
            delete n[key];
            setErrors(n);
        }
    };

    const safeHaptics = async (type: 'success' | 'error' | 'impact') => {
        if (Platform.OS === 'web') return;
        try {
            if (type === 'success') await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            if (type === 'error') await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            if (type === 'impact') await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (e) {
            console.warn('Haptics error', e);
        }
    };

    const pickImage = async (field: 'photo' | 'doublePedalPhoto') => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });
        if (!result.canceled) updateData(field, result.assets[0].uri);
    };

    const handleBlurCep = async () => {
        if (data.addressZip.length >= 9) {
            try {
                const addr = await fetchAddress(data.addressZip);
                if (addr) {
                    setData(prev => ({
                        ...prev,
                        addressStreet: addr.street,
                        addressNeighborhood: addr.neighborhood,
                        addressCity: addr.city,
                        addressState: addr.state
                    }));
                    safeHaptics('success');
                }
            } catch (e) {
                setErrors(prev => ({ ...prev, addressZip: 'CEP não encontrado. Confira os números.' }));
                safeHaptics('error');
            }
        }
    };

    const handleNext = () => {
        // Validation Logic per step
        let isValid = true;
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!data.photo) { newErrors.photo = 'Foto necessária'; isValid = false; }
            if (!data.make) { newErrors.make = 'Marca obrigatória'; isValid = false; }
            if (!data.model) { newErrors.model = 'Modelo obrigatório'; isValid = false; }
            if (!data.year) { newErrors.year = 'Ano obrigatório'; isValid = false; }
            if (!data.plate || data.plate.length < 4) { newErrors.plate = 'Placa (4 dígitos) obrigatória'; isValid = false; }
        }

        if (step === 2) {
            // Specs
            if (!data.motor) { newErrors.motor = 'Motor obrigatório'; isValid = false; }
            if (!data.transmission) { newErrors.transmission = 'Câmbio obrigatório'; isValid = false; }
        }

        if (step === 3) {
            // Address
            if (data.addressZip.length < 9) { newErrors.addressZip = 'CEP inválido'; isValid = false; }
            if (!data.addressStreet) { newErrors.addressStreet = 'Rua obrigatória'; isValid = false; }
            if (!data.addressNumber) { newErrors.addressNumber = 'Número obrigatório'; isValid = false; }
            if (!data.addressNeighborhood) { newErrors.addressNeighborhood = 'Bairro obrigatório'; isValid = false; }
            if (!data.addressCity) { newErrors.addressCity = 'Cidade obrigatória'; isValid = false; }
            if (!data.addressState) { newErrors.addressState = 'UF obrigatória'; isValid = false; }
        }

        if (step === 4) {
            // Safety
            if (isInstructor) {
                if (!data.hasDoublePedal) {
                    // Checkbox logic
                }
                if (data.hasDoublePedal && !data.doublePedalPhoto) {
                    newErrors.doublePedalPhoto = 'Foto do duplo comando obrigatória'; isValid = false;
                }
            }
        }

        if (!isValid) {
            setErrors(newErrors);
            safeHaptics('error');
            return;
        }

        if (step < 4) setStep(step + 1);
        else handleSubmit();
    };

    const handleSubmit = () => {
        setLoading(true);
        safeHaptics('impact');
        setTimeout(() => {
            setLoading(false);
            router.replace('/success');
        }, 1500);
    };

    const renderStepIcon = (s: number, icon: any) => {
        const active = step >= s;
        return (
            <View style={[styles.stepItem, active && styles.stepItemActive]}>
                <Ionicons name={icon} size={20} color={active ? tokens.colors.text.white : tokens.colors.text.secondary} />
            </View>
        )
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={tokens.colors.text.primary} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.title}>Veículo para aula</Text>
                    <Text style={styles.subtitle}>Passo {step} de 4</Text>
                </View>
            </View>

            <View style={styles.stepper}>
                {renderStepIcon(1, 'car')}
                <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
                {renderStepIcon(2, 'settings')}
                <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />
                {renderStepIcon(3, 'map')}
                <View style={[styles.stepLine, step >= 4 && styles.stepLineActive]} />
                {renderStepIcon(4, 'shield-checkmark')}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {step === 1 && (
                    <View style={styles.form}>
                        <TouchableOpacity onPress={() => pickImage('photo')} style={styles.carPhotoBtn}>
                            {data.photo ? <Image source={{ uri: data.photo }} style={styles.carPhoto} /> : (
                                <View style={styles.placeholder}>
                                    <Ionicons name="camera" size={32} color={tokens.colors.text.secondary} />
                                    <Text style={styles.placeholderText}>Foto do veículo (16:9)</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        {errors.photo && <Text style={styles.errorText}>{errors.photo}</Text>}

                        <Text style={styles.label}>Marca</Text>
                        <TextInput style={styles.input} value={data.make} onChangeText={t => updateData('make', t)} placeholder="Ex: Volkswagen" placeholderTextColor={tokens.colors.text.placeholder} />

                        <Text style={styles.label}>Modelo</Text>
                        <TextInput style={styles.input} value={data.model} onChangeText={t => updateData('model', t)} placeholder="Ex: Gol" placeholderTextColor={tokens.colors.text.placeholder} />

                        <View style={styles.row}>
                            <View style={styles.flex1}>
                                <Text style={styles.label}>Ano</Text>
                                <TextInput style={styles.input} value={data.year} onChangeText={t => updateData('year', t)} keyboardType="numeric" placeholder="2020" placeholderTextColor={tokens.colors.text.placeholder} />
                            </View>
                            <View style={styles.flex1}>
                                <Text style={styles.label}>Cor</Text>
                                <TextInput style={styles.input} value={data.color} onChangeText={t => updateData('color', t)} placeholder="Branco" placeholderTextColor={tokens.colors.text.placeholder} />
                            </View>
                        </View>

                        <Text style={styles.label}>Placa (4 últimos dígitos)</Text>
                        <TextInput style={styles.input} value={data.plate} onChangeText={t => updateData('plate', t)} placeholder="ABCD-1234 (Final)" placeholderTextColor={tokens.colors.text.placeholder} />
                    </View>
                )}

                {step === 2 && (
                    <View style={styles.form}>
                        <Text style={styles.label}>Motor</Text>
                        <TextInput style={styles.input} value={data.motor} onChangeText={t => updateData('motor', t)} placeholder="Ex: 1.0 Turbo" placeholderTextColor={tokens.colors.text.placeholder} />

                        <Text style={styles.label}>Potência (cv)</Text>
                        <TextInput style={styles.input} value={data.power} onChangeText={t => updateData('power', t)} keyboardType="numeric" placeholder="120" placeholderTextColor={tokens.colors.text.placeholder} />

                        <Text style={styles.label}>Câmbio</Text>
                        <View style={styles.selectorRow}>
                            {['Manual', 'Automático'].map(opt => (
                                <TouchableOpacity key={opt} onPress={() => updateData('transmission', opt)} style={[styles.optionChip, data.transmission === opt && styles.optionChipActive]}>
                                    <Text style={[styles.optionText, data.transmission === opt && styles.optionTextActive]}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Categoria</Text>
                        <View style={styles.selectorRow}>
                            {['Hatch', 'Sedan', 'SUV'].map(opt => (
                                <TouchableOpacity key={opt} onPress={() => updateData('category', opt)} style={[styles.optionChip, data.category === opt && styles.optionChipActive]}>
                                    <Text style={[styles.optionText, data.category === opt && styles.optionTextActive]}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {step === 3 && (
                    <View style={styles.form}>
                        <Text style={styles.sectionTitle}>Endereço da aula</Text>
                        <View>
                            <Text style={styles.label}>CEP</Text>
                            <MaskInput
                                style={[styles.input, errors.addressZip && styles.inputError]}
                                value={data.addressZip}
                                onChangeText={(masked) => updateData('addressZip', masked)}
                                mask={CEP_MASK}
                                placeholder="Ex: 01310-200"
                                placeholderTextColor={tokens.colors.text.placeholder}
                                keyboardType="numeric"
                                onBlur={handleBlurCep}
                                aria-label="CEP preenchido automaticamente"
                            />
                            {loadingAddress && <Text style={styles.helperText}>Buscando endereço...</Text>}
                            {errors.addressZip ? (
                                <Text style={styles.errorText}>{errors.addressZip}</Text>
                            ) : (
                                <Text style={styles.helperText}>Preencherá automaticamente</Text>
                            )}
                        </View>

                        <View style={styles.row}>
                            <View style={{ flex: 3 }}>
                                <Text style={styles.label}>Logradouro</Text>
                                <TextInput
                                    style={[styles.input, loadingAddress && styles.inputDisabled, errors.addressStreet && styles.inputError]}
                                    value={data.addressStreet}
                                    onChangeText={(t) => updateData('addressStreet', t)}
                                    placeholder="Rua..."
                                    placeholderTextColor={tokens.colors.text.placeholder}
                                    editable={!loadingAddress}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Número</Text>
                                <TextInput
                                    style={[styles.input, errors.addressNumber && styles.inputError]}
                                    value={data.addressNumber}
                                    onChangeText={(t) => updateData('addressNumber', t)}
                                    placeholder="123"
                                    placeholderTextColor={tokens.colors.text.placeholder}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        {errors.addressNumber && <Text style={styles.errorText}>Número obrigatório</Text>}

                        <View>
                            <Text style={styles.label}>Bairro</Text>
                            <TextInput
                                style={[styles.input, loadingAddress && styles.inputDisabled, errors.addressNeighborhood && styles.inputError]}
                                value={data.addressNeighborhood}
                                onChangeText={(t) => updateData('addressNeighborhood', t)}
                                placeholder="Bairro"
                                placeholderTextColor={tokens.colors.text.placeholder}
                                editable={!loadingAddress}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={{ flex: 3 }}>
                                <Text style={styles.label}>Cidade</Text>
                                <TextInput
                                    style={[styles.input, loadingAddress && styles.inputDisabled, errors.addressCity && styles.inputError]}
                                    value={data.addressCity}
                                    onChangeText={(t) => updateData('addressCity', t)}
                                    placeholder="Cidade"
                                    placeholderTextColor={tokens.colors.text.placeholder}
                                    editable={!loadingAddress}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>UF</Text>
                                <TextInput
                                    style={[styles.input, loadingAddress && styles.inputDisabled, errors.addressState && styles.inputError]}
                                    value={data.addressState}
                                    onChangeText={(t) => updateData('addressState', t)}
                                    placeholder="UF"
                                    placeholderTextColor={tokens.colors.text.placeholder}
                                    maxLength={2}
                                    editable={!loadingAddress}
                                />
                            </View>
                        </View>
                    </View>
                )}

                {step === 4 && (
                    <View style={styles.form}>
                        {isInstructor && (
                            <View style={styles.section}>
                                <View style={styles.switchRow}>
                                    <Text style={styles.label}>Duplo pedal instalado?</Text>
                                    <Switch value={data.hasDoublePedal} onValueChange={v => updateData('hasDoublePedal', v)} />
                                </View>
                                {data.hasDoublePedal && (
                                    <TouchableOpacity onPress={() => pickImage('doublePedalPhoto')} style={styles.pedalPhotoBtn}>
                                        {data.doublePedalPhoto ? <Image source={{ uri: data.doublePedalPhoto }} style={styles.carPhoto} /> : (
                                            <View style={styles.placeholder}>
                                                <Ionicons name="camera" size={24} color={tokens.colors.text.secondary} />
                                                <Text style={styles.placeholderText}>Foto do mecanismo</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                )}
                                {errors.doublePedalPhoto && <Text style={styles.errorText}>{errors.doublePedalPhoto}</Text>}

                                <View style={[styles.switchRow, { marginTop: 16 }]}>
                                    <Text style={styles.label}>Aceita carro do aluno?</Text>
                                    <Switch value={data.acceptStudentCar} onValueChange={v => updateData('acceptStudentCar', v)} />
                                </View>
                            </View>
                        )}

                        <Text style={styles.label}>Acessórios & Segurança</Text>
                        <Text style={styles.helperText}>Selecione o que o veículo possui</Text>

                        <View style={styles.tagsContainer}>
                            {['Ar Condicionado', 'Direção Hidráulica', 'ABS', 'Airbag', 'Câmera de Ré', 'Sensor de Ré'].map(item => {
                                const active = data.comfort.includes(item);
                                return (
                                    <TouchableOpacity key={item} style={[styles.tag, active && styles.tagActive]} onPress={() => {
                                        const list = active ? data.comfort.filter(i => i !== item) : [...data.comfort, item];
                                        updateData('comfort', list);
                                    }}>
                                        <Text style={[styles.tagText, active && styles.tagTextActive]}>{item}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={handleNext}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{step === 4 ? 'Finalizar' : 'Próximo'}</Text>}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: tokens.colors.background.primary },
    header: {
        paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16,
        flexDirection: 'row', alignItems: 'center', gap: 16
    },
    backButton: { padding: 4 },
    title: { fontSize: 20, fontWeight: '700', color: tokens.colors.text.primary },
    subtitle: { fontSize: 14, color: tokens.colors.text.secondary },
    stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, backgroundColor: tokens.colors.background.secondary },
    stepItem: { width: 32, height: 32, borderRadius: 16, backgroundColor: tokens.colors.background.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: tokens.colors.border.secondary },
    stepItemActive: { backgroundColor: tokens.colors.background.brandPrimary, borderColor: tokens.colors.background.brandPrimary },
    stepLine: { width: 24, height: 2, backgroundColor: tokens.colors.border.secondary },
    stepLineActive: { backgroundColor: tokens.colors.background.brandPrimary },
    scrollContent: { padding: 24 },
    form: { gap: 16 },
    label: { color: tokens.colors.text.secondary, fontSize: 14, fontWeight: '500', marginBottom: 4 },
    input: { height: 48, borderWidth: 1, borderColor: tokens.colors.border.secondary, borderRadius: 8, paddingHorizontal: 16, color: tokens.colors.text.primary, backgroundColor: tokens.colors.background.secondary },
    inputDisabled: { opacity: 0.7, backgroundColor: tokens.colors.background.tertiary },
    inputError: { borderColor: tokens.colors.border.error },
    carPhotoBtn: { height: 200, borderRadius: 12, backgroundColor: tokens.colors.background.secondary, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: tokens.colors.border.secondary, overflow: 'hidden' },
    carPhoto: { width: '100%', height: '100%' },
    placeholder: { alignItems: 'center', gap: 8 },
    placeholderText: { color: tokens.colors.text.secondary },
    errorText: { color: tokens.colors.text.error, fontSize: 12 },
    row: { flexDirection: 'row', gap: 16 },
    flex1: { flex: 1 },
    selectorRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    optionChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: tokens.colors.border.secondary },
    optionChipActive: { backgroundColor: tokens.colors.background.brandPrimary, borderColor: tokens.colors.background.brandPrimary },
    optionText: { color: tokens.colors.text.secondary },
    optionTextActive: { color: tokens.colors.text.white, fontWeight: '600' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    section: { backgroundColor: tokens.colors.background.secondary, padding: 16, borderRadius: 8 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: tokens.colors.text.primary, marginBottom: 12 },
    pedalPhotoBtn: { height: 120, marginTop: 16, borderRadius: 8, backgroundColor: tokens.colors.background.primary, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: tokens.colors.border.secondary },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: tokens.colors.background.secondary, borderWidth: 1, borderColor: tokens.colors.border.secondary },
    tagActive: { backgroundColor: tokens.colors.background.brandPrimary, borderColor: tokens.colors.background.brandPrimary },
    tagText: { color: tokens.colors.text.secondary, fontSize: 12 },
    tagTextActive: { color: tokens.colors.text.white },
    helperText: { color: tokens.colors.text.tertiary, fontSize: 12, marginBottom: 8 },
    footer: { padding: 24, borderTopWidth: 1, borderColor: tokens.colors.border.secondary, backgroundColor: tokens.colors.background.primary },
    buttonPrimary: { height: 48, backgroundColor: tokens.colors.background.brandPrimary, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    buttonText: { color: tokens.colors.text.primaryOnBrand, fontWeight: '600', fontSize: 16 }
});
