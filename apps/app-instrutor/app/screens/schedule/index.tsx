import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { colors, spacing, radius, typography } from "@/theme";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

const DAYS = [
    { id: 1, label: "Segunda-feira" },
    { id: 2, label: "Terça-feira" },
    { id: 3, label: "Quarta-feira" },
    { id: 4, label: "Quinta-feira" },
    { id: 5, label: "Sexta-feira" },
    { id: 6, label: "Sábado" },
    { id: 0, label: "Domingo" },
];

interface DaySchedule {
    dayOfWeek: number;
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
}

export default function ScheduleScreen() {
    const router = useRouter();
    const utils = trpc.useContext();

    const [schedule, setSchedule] = useState<DaySchedule[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    // Buscar configurações atuais
    const { data: currentSchedule, isLoading } = trpc.availability.getMySettings.useQuery(undefined, {
        onSuccess: (data) => {
            setSchedule(data);
        }
    });

    // Salvar configurações
    const updateMutation = trpc.availability.updateSettings.useMutation({
        onSuccess: () => {
            utils.availability.getMySettings.invalidate();
            Alert.alert("Sucesso", "Agenda atualizada com sucesso!");
            setHasChanges(false);
        },
        onError: (err) => {
            Alert.alert("Erro", "Falha ao salvar agenda.");
        }
    });

    const toggleShift = (dayIndex: number, shift: 'morning' | 'afternoon' | 'evening') => {
        setSchedule(prev => prev.map(day => {
            if (day.dayOfWeek === dayIndex) {
                return { ...day, [shift]: !day[shift] };
            }
            return day;
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
        updateMutation.mutate(schedule);
    };

    const renderDayRow = (day: { id: number, label: string }) => {
        const dayState = schedule.find(d => d.dayOfWeek === day.id) || {
            dayOfWeek: day.id, morning: false, afternoon: false, evening: false
        };

        return (
            <View key={day.id} style={styles.dayRow}>
                <Text style={styles.dayLabel}>{day.label}</Text>

                <View style={styles.shiftsContainer}>
                    <TouchableOpacity
                        style={[styles.shiftButton, dayState.morning && styles.shiftButtonActive]}
                        onPress={() => toggleShift(day.id, 'morning')}
                    >
                        <Text style={[styles.shiftText, dayState.morning && styles.shiftTextActive]}>Manhã</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.shiftButton, dayState.afternoon && styles.shiftButtonActive]}
                        onPress={() => toggleShift(day.id, 'afternoon')}
                    >
                        <Text style={[styles.shiftText, dayState.afternoon && styles.shiftTextActive]}>Tarde</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.shiftButton, dayState.evening && styles.shiftButtonActive]}
                        onPress={() => toggleShift(day.id, 'evening')}
                    >
                        <Text style={[styles.shiftText, dayState.evening && styles.shiftTextActive]}>Noite</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.background.brandPrimary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Minha Agenda</Text>
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={!hasChanges || updateMutation.isLoading}
                >
                    {updateMutation.isLoading ? (
                        <ActivityIndicator size="small" color={colors.background.brandPrimary} />
                    ) : (
                        <Text style={[styles.saveText, !hasChanges && styles.saveTextDisabled]}>Salvar</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.infoCard}>
                    <Ionicons name="information-circle-outline" size={20} color={colors.text.secondary} />
                    <Text style={styles.infoText}>
                        Defina seus turnos de disponibilidade fixa. Dias não marcados aparecerão como indisponíveis.
                    </Text>
                </View>

                <View style={styles.scheduleTable}>
                    {DAYS.map(renderDayRow)}
                </View>

                <View style={styles.legendContainer}>
                    <Text style={styles.legendTitle}>Legenda de Turnos:</Text>
                    <Text style={styles.legendItem}>• Manhã: 08:00 - 12:00</Text>
                    <Text style={styles.legendItem}>• Tarde: 13:00 - 17:00</Text>
                    <Text style={styles.legendItem}>• Noite: 18:00 - 22:00</Text>
                </View>
            </ScrollView>
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
        borderBottomWidth: 1,
        borderBottomColor: colors.border.secondary,
        backgroundColor: colors.background.secondary,
    },
    headerTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
    },
    saveText: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.bold,
        color: colors.background.brandPrimary,
    },
    saveTextDisabled: {
        color: colors.text.disabled,
    },
    content: {
        padding: spacing.lg,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: colors.background.secondary,
        padding: spacing.md,
        borderRadius: radius.md,
        marginBottom: spacing.xl,
        gap: spacing.md,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        color: colors.text.secondary,
        fontSize: typography.fontSize.sm,
    },
    scheduleTable: {
        backgroundColor: colors.background.secondary,
        borderRadius: radius.lg,
        padding: spacing.lg,
    },
    dayRow: {
        marginBottom: spacing.lg,
    },
    dayLabel: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    shiftsContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    shiftButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border.secondary,
        borderRadius: radius.md,
        alignItems: 'center',
    },
    shiftButtonActive: {
        backgroundColor: 'rgba(234, 179, 8, 0.1)', // Amarelo bem claro
        borderColor: colors.background.brandPrimary,
    },
    shiftText: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
        fontWeight: typography.fontWeight.medium,
    },
    shiftTextActive: {
        color: colors.background.brandPrimary,
        fontWeight: typography.fontWeight.bold,
    },
    legendContainer: {
        marginTop: spacing.xl,
        padding: spacing.lg,
    },
    legendTitle: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.secondary,
        marginBottom: spacing.sm,
    },
    legendItem: {
        fontSize: typography.fontSize.xs,
        color: colors.text.tertiary,
        lineHeight: 20,
    },
});
