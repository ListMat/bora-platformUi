import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, Image, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { trpc } from '@/lib/trpc';
import { colors, spacing, radius, typography } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

// Métodos de pagamento
const PAYMENT_METHODS = [
    { id: 'PIX', label: 'Pix', icon: 'qr-code-outline' as const },
    { id: 'CREDIT_CARD', label: 'Cartão de Crédito', icon: 'card-outline' as const },
    { id: 'CASH', label: 'Dinheiro', icon: 'cash-outline' as const },
];

export default function LessonCheckout() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Garantir que temos strings
    const instructorId = Array.isArray(params.instructorId) ? params.instructorId[0] : params.instructorId;
    const packageId = Array.isArray(params.packageId) ? params.packageId[0] : params.packageId;
    const scheduleId = Array.isArray(params.scheduleId) ? params.scheduleId[0] : params.scheduleId;

    const [paymentMethod, setPaymentMethod] = useState('PIX');

    // Queries
    const { data: instructor, isLoading: loadingInstr } = trpc.instructor.getById.useQuery(
        { id: instructorId || '' },
        { enabled: !!instructorId }
    );

    const { data: plans } = trpc.plan.list.useQuery({ instructorId: instructorId || undefined });
    const selectedPlan = plans?.find(p => p.id === packageId);

    const createLessonMutation = trpc.lesson.request.useMutation({
        onSuccess: () => {
            Alert.alert("Sucesso!", "Sua solicitação foi enviada para o instrutor.");
            router.push("/(tabs)/");
        },
        onError: (err) => {
            Alert.alert("Erro", err.message || "Erro ao solicitar aula");
        }
    });

    const handleConfirm = () => {
        if (!scheduleId || !instructorId || !packageId) return;

        // Parse da data: "06/01-morning" -> Date object
        const [dateStr, shift] = scheduleId.split('-');
        const [day, month] = dateStr.split('/').map(Number);

        const now = new Date();
        const year = now.getFullYear();

        // Ajuste ano se necessário (ex: Dezembro p/ Janeiro)
        let targetYear = year;
        // Se mês setado (ex: 01) < mês atual (ex: 12), significa ano seguinte
        if (month < now.getMonth() + 1) targetYear++;

        const date = new Date(targetYear, month - 1, day);

        let hour = 8;
        if (shift === 'afternoon') hour = 13;
        if (shift === 'evening') hour = 18;

        date.setHours(hour, 0, 0, 0);

        // Preço do plano
        const price = selectedPlan?.price || 0;

        createLessonMutation.mutate({
            instructorId,
            scheduledAt: date,
            lessonType: "Prática", // Default para MVP
            planId: packageId,
            paymentMethod: paymentMethod as any,
            price: price,
            installments: 1
        });
    };

    if (loadingInstr || !selectedPlan) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.background.brandPrimary} />
            </View>
        );
    }

    const shiftLabel = scheduleId ? (
        scheduleId.includes('morning') ? 'Manhã (08:00 - 12:00)' :
            scheduleId.includes('afternoon') ? 'Tarde (13:00 - 17:00)' : 'Noite (18:00 - 22:00)'
    ) : '';

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confirmar Agendamento</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Resumo Instrutor */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Instrutor</Text>
                    <View style={styles.instructorCard}>
                        <Image
                            source={{ uri: instructor?.user?.image || 'https://via.placeholder.com/150' }}
                            style={styles.avatar}
                        />
                        <View style={styles.instructorInfo}>
                            <Text style={styles.instructorName}>{instructor?.user?.name}</Text>
                            <Text style={styles.instructorVehicle}>
                                {instructor?.vehicles?.[0] ? `${instructor.vehicles[0].brand} ${instructor.vehicles[0].model}` : 'Veículo padrão'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Resumo Aula */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalhes da Aula</Text>

                    <View style={styles.summaryCard}>
                        <View style={styles.detailRow}>
                            <Ionicons name="calendar" size={20} color={colors.background.brandPrimary} />
                            <View>
                                <Text style={styles.detailLabel}>Data e Turno</Text>
                                <Text style={styles.detailText}>
                                    {scheduleId?.split('-')[0]} • {shiftLabel}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                            <Ionicons name="apps" size={20} color={colors.background.brandPrimary} />
                            <View>
                                <Text style={styles.detailLabel}>Pacote Selecionado</Text>
                                <Text style={styles.detailText}>
                                    {selectedPlan.name}
                                </Text>
                                <Text style={styles.subText}>{selectedPlan.lessons} aulas práticas</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.totalLabel}>Total a pagar:</Text>
                        <Text style={styles.totalValue}>R$ {selectedPlan.price.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Pagamento */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
                    {PAYMENT_METHODS.map(method => (
                        <TouchableOpacity
                            key={method.id}
                            style={[
                                styles.paymentOption,
                                paymentMethod === method.id && styles.paymentOptionSelected
                            ]}
                            onPress={() => setPaymentMethod(method.id)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                                <Ionicons
                                    name={method.icon}
                                    size={24}
                                    color={paymentMethod === method.id ? colors.background.brandPrimary : colors.text.secondary}
                                />
                                <Text style={[
                                    styles.paymentLabel,
                                    paymentMethod === method.id && styles.paymentLabelSelected
                                ]}>{method.label}</Text>
                            </View>
                            {paymentMethod === method.id && (
                                <Ionicons name="checkmark-circle" size={24} color={colors.background.brandPrimary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Footer Fixo */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirm}
                    disabled={createLessonMutation.isLoading}
                >
                    {createLessonMutation.isLoading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.confirmButtonText}>Confirmar e Agendar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background.primary,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: spacing.xl,
        paddingTop: spacing.xl,
        backgroundColor: colors.background.secondary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.secondary,
    },
    headerTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
    },
    content: {
        padding: spacing.lg,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    instructorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        padding: spacing.md,
        borderRadius: radius.lg,
        gap: spacing.md,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.background.tertiary,
    },
    instructorInfo: {
        flex: 1,
    },
    instructorName: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
    },
    instructorVehicle: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    summaryCard: {
        backgroundColor: colors.background.secondary,
        borderRadius: radius.lg,
        padding: spacing.lg,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.xs,
    },
    detailLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.text.tertiary,
        marginBottom: 2,
    },
    detailText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.primary,
    },
    subText: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border.secondary,
        marginVertical: spacing.md,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border.secondary,
    },
    totalLabel: {
        fontSize: typography.fontSize.base,
        color: colors.text.secondary,
    },
    totalValue: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.background.brandPrimary,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
        backgroundColor: colors.background.secondary,
        borderRadius: radius.lg,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    paymentOptionSelected: {
        borderColor: colors.background.brandPrimary,
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
    },
    paymentLabel: {
        fontSize: typography.fontSize.base,
        color: colors.text.secondary,
        fontWeight: typography.fontWeight.medium,
    },
    paymentLabelSelected: {
        color: colors.text.primary,
        fontWeight: typography.fontWeight.bold,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.xl,
        backgroundColor: colors.background.secondary,
        borderTopWidth: 1,
        borderTopColor: colors.border.secondary,
    },
    confirmButton: {
        backgroundColor: colors.background.brandPrimary,
        padding: spacing.lg,
        borderRadius: radius.xl,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: colors.text.white, // assuming brandPrimary is yellow/dark so black/white text
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.bold,
    }
});
