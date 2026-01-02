import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    Platform,
    Dimensions,
} from "react-native";
import { useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/theme";
import { useHaptic } from "@/hooks/useHaptic";
import { trpc } from "@/lib/trpc";
import { format, addDays, startOfDay, addHours } from "date-fns";
import { ptBR } from "date-fns/locale";

const { width } = Dimensions.get("window");

interface AcceptLessonsModalProps {
    visible: boolean;
    instructorId: string;
    onClose: () => void;
    onSuccess?: () => void;
}

const LESSON_TYPES = [
    { id: "1ª Habilitação", label: "1ª Habilitação", icon: "🎓" },
    { id: "Direção via pública", label: "Direção via pública", icon: "🚗" },
    { id: "Baliza", label: "Baliza", icon: "📐" },
    { id: "Noturna", label: "Noturna", icon: "🌙" },
    { id: "Simulado", label: "Simulado", icon: "📝" },
    { id: "Renovação CNH", label: "Renovação CNH", icon: "🔄" },
];

export default function AcceptLessonsModal({
    visible,
    instructorId,
    onClose,
    onSuccess,
}: AcceptLessonsModalProps) {
    const haptic = useHaptic();
    const [currentStep, setCurrentStep] = useState(1);

    // Step 1: Disponibilidade
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

    // Step 2: Tipo de Aula
    const [selectedLessonTypes, setSelectedLessonTypes] = useState<string[]>([]);

    // Step 3: Veículo
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [acceptsOwnVehicle, setAcceptsOwnVehicle] = useState(false);

    const { data: vehiclesData } = trpc.instructor.vehicles.useQuery(
        { instructorId },
        { enabled: visible }
    );

    const acceptLessonsMutation = trpc.instructor.acceptLessons.useMutation();

    // Gerar próximos 7 dias
    const dates = useMemo(() => {
        const today = startOfDay(new Date());
        return Array.from({ length: 7 }, (_, i) => addDays(today, i));
    }, []);

    // Gerar slots de horário (8h às 20h, intervalos de 30 min)
    const timeSlots = useMemo(() => {
        const slots: string[] = [];
        const baseDate = new Date();
        baseDate.setHours(8, 0, 0, 0);

        for (let i = 0; i < 24; i++) {
            const time = addHours(baseDate, i * 0.5);
            slots.push(format(time, "HH:mm"));
        }

        return slots;
    }, []);

    const handleNext = () => {
        haptic.light();

        if (currentStep === 1 && (!selectedDate || selectedTimeSlots.length === 0)) {
            return;
        }
        if (currentStep === 2 && selectedLessonTypes.length === 0) {
            return;
        }

        setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        haptic.light();
        setCurrentStep(currentStep - 1);
    };

    const handleConfirm = async () => {
        try {
            haptic.medium();

            await acceptLessonsMutation.mutateAsync({
                instructorId,
                date: selectedDate!,
                timeSlots: selectedTimeSlots,
                lessonTypes: selectedLessonTypes,
                vehicleId: selectedVehicleId,
                acceptsOwnVehicle,
            });

            haptic.success();
            onSuccess?.();
            onClose();
            resetForm();
        } catch (error) {
            console.error("Error accepting lessons:", error);
        }
    };

    const resetForm = () => {
        setCurrentStep(1);
        setSelectedDate(null);
        setSelectedTimeSlots([]);
        setSelectedLessonTypes([]);
        setSelectedVehicleId(null);
        setAcceptsOwnVehicle(false);
    };

    const toggleTimeSlot = (slot: string) => {
        if (selectedTimeSlots.includes(slot)) {
            setSelectedTimeSlots(selectedTimeSlots.filter((s) => s !== slot));
        } else {
            setSelectedTimeSlots([...selectedTimeSlots, slot]);
        }
    };

    const toggleLessonType = (type: string) => {
        if (selectedLessonTypes.includes(type)) {
            setSelectedLessonTypes(selectedLessonTypes.filter((t) => t !== type));
        } else {
            setSelectedLessonTypes([...selectedLessonTypes, type]);
        }
    };

    const canProceed = () => {
        if (currentStep === 1) return selectedDate && selectedTimeSlots.length > 0;
        if (currentStep === 2) return selectedLessonTypes.length > 0;
        if (currentStep === 3) return selectedVehicleId || acceptsOwnVehicle;
        return false;
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                            haptic.light();
                            onClose();
                            resetForm();
                        }}
                    >
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Aceitar Aulas</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Progress */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${(currentStep / 3) * 100}%` },
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        Passo {currentStep} de 3
                    </Text>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Step 1: Disponibilidade */}
                    {currentStep === 1 && (
                        <View style={styles.step}>
                            <Text style={styles.stepTitle}>Quando você está disponível?</Text>

                            {/* Datas */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.datesScroll}
                            >
                                {dates.map((date) => {
                                    const isSelected = selectedDate?.getTime() === date.getTime();
                                    return (
                                        <TouchableOpacity
                                            key={date.toISOString()}
                                            style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                                            onPress={() => {
                                                haptic.light();
                                                setSelectedDate(date);
                                            }}
                                        >
                                            <Text style={[styles.dateDay, isSelected && styles.dateDaySelected]}>
                                                {format(date, "EEE", { locale: ptBR })}
                                            </Text>
                                            <Text style={[styles.dateNumber, isSelected && styles.dateNumberSelected]}>
                                                {format(date, "dd")}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>

                            {/* Horários */}
                            {selectedDate && (
                                <>
                                    <Text style={styles.sectionTitle}>Horários disponíveis</Text>
                                    <View style={styles.timeSlotsGrid}>
                                        {timeSlots.map((slot) => {
                                            const isSelected = selectedTimeSlots.includes(slot);
                                            return (
                                                <TouchableOpacity
                                                    key={slot}
                                                    style={[styles.timeSlot, isSelected && styles.timeSlotSelected]}
                                                    onPress={() => {
                                                        haptic.light();
                                                        toggleTimeSlot(slot);
                                                    }}
                                                >
                                                    <Text style={[styles.timeSlotText, isSelected && styles.timeSlotTextSelected]}>
                                                        {slot}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </>
                            )}
                        </View>
                    )}

                    {/* Step 2: Tipo de Aula */}
                    {currentStep === 2 && (
                        <View style={styles.step}>
                            <Text style={styles.stepTitle}>Que tipos de aula você aceita?</Text>

                            <View style={styles.lessonTypesGrid}>
                                {LESSON_TYPES.map((type) => {
                                    const isSelected = selectedLessonTypes.includes(type.id);
                                    return (
                                        <TouchableOpacity
                                            key={type.id}
                                            style={[styles.lessonTypeCard, isSelected && styles.lessonTypeCardSelected]}
                                            onPress={() => {
                                                haptic.light();
                                                toggleLessonType(type.id);
                                            }}
                                        >
                                            <Text style={styles.lessonTypeIcon}>{type.icon}</Text>
                                            <Text style={[styles.lessonTypeLabel, isSelected && styles.lessonTypeLabelSelected]}>
                                                {type.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {/* Step 3: Veículo */}
                    {currentStep === 3 && (
                        <View style={styles.step}>
                            <Text style={styles.stepTitle}>Qual veículo você vai usar?</Text>

                            {vehiclesData?.map((vehicle) => {
                                const isSelected = selectedVehicleId === vehicle.id;
                                return (
                                    <TouchableOpacity
                                        key={vehicle.id}
                                        style={[styles.vehicleCard, isSelected && styles.vehicleCardSelected]}
                                        onPress={() => {
                                            haptic.light();
                                            setSelectedVehicleId(vehicle.id);
                                        }}
                                    >
                                        <View style={styles.vehicleInfo}>
                                            <Text style={styles.vehicleModel}>
                                                {vehicle.brand} {vehicle.model}
                                            </Text>
                                            <Text style={styles.vehicleTransmission}>
                                                {vehicle.transmission === "AUTOMATIC" ? "Automático" : "Manual"}
                                            </Text>
                                        </View>
                                        {isSelected && (
                                            <Ionicons name="checkmark-circle" size={24} color={colors.background.brandPrimary} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}

                            {/* Aceita carro do aluno */}
                            <TouchableOpacity
                                style={[styles.ownVehicleCard, acceptsOwnVehicle && styles.ownVehicleCardSelected]}
                                onPress={() => {
                                    haptic.light();
                                    setAcceptsOwnVehicle(!acceptsOwnVehicle);
                                }}
                            >
                                <View style={styles.ownVehicleInfo}>
                                    <Text style={styles.ownVehicleTitle}>Aceitar carro do aluno</Text>
                                    <Text style={styles.ownVehicleDescription}>
                                        Você pode dar aulas no carro do aluno
                                    </Text>
                                </View>
                                {acceptsOwnVehicle && (
                                    <Ionicons name="checkmark-circle" size={24} color={colors.background.brandPrimary} />
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    {currentStep > 1 && (
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
                            <Text style={styles.backButtonText}>Voltar</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.nextButton,
                            !canProceed() && styles.nextButtonDisabled,
                            currentStep === 1 && styles.nextButtonFull,
                        ]}
                        onPress={currentStep === 3 ? handleConfirm : handleNext}
                        disabled={!canProceed() || acceptLessonsMutation.isLoading}
                    >
                        <Text style={styles.nextButtonText}>
                            {currentStep === 3
                                ? acceptLessonsMutation.isLoading
                                    ? "Salvando..."
                                    : "Aceitar Chamadas"
                                : "Continuar"}
                        </Text>
                        {currentStep < 3 && (
                            <Ionicons name="arrow-forward" size={20} color={colors.text.white} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: Platform.OS === "ios" ? 50 : 40,
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.secondary,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: radius.full,
        backgroundColor: colors.background.secondary,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
    },
    progressContainer: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
    },
    progressBar: {
        height: 4,
        backgroundColor: colors.background.tertiary,
        borderRadius: radius.full,
        marginBottom: spacing.sm,
    },
    progressFill: {
        height: "100%",
        backgroundColor: colors.background.brandPrimary,
        borderRadius: radius.full,
    },
    progressText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        textAlign: "center",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing["4xl"],
    },
    step: {
        padding: spacing.xl,
    },
    stepTitle: {
        fontSize: typography.fontSize["2xl"],
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
        marginTop: spacing.xl,
        marginBottom: spacing.md,
    },
    datesScroll: {
        gap: spacing.md,
        paddingBottom: spacing.md,
    },
    dateCard: {
        width: 70,
        paddingVertical: spacing.md,
        backgroundColor: colors.background.secondary,
        borderRadius: radius.lg,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "transparent",
    },
    dateCardSelected: {
        borderColor: colors.background.brandPrimary,
        backgroundColor: colors.background.brandSecondary,
    },
    dateDay: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
        textTransform: "capitalize",
    },
    dateDaySelected: {
        color: colors.background.brandPrimary,
    },
    dateNumber: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
    },
    dateNumberSelected: {
        color: colors.background.brandPrimary,
    },
    timeSlotsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.sm,
    },
    timeSlot: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.background.secondary,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border.secondary,
    },
    timeSlotSelected: {
        backgroundColor: colors.background.brandSecondary,
        borderColor: colors.background.brandPrimary,
    },
    timeSlotText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.primary,
    },
    timeSlotTextSelected: {
        color: colors.background.brandPrimary,
        fontWeight: typography.fontWeight.semibold,
    },
    lessonTypesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.md,
    },
    lessonTypeCard: {
        width: (width - spacing.xl * 2 - spacing.md) / 2,
        paddingVertical: spacing.lg,
        backgroundColor: colors.background.secondary,
        borderRadius: radius.xl,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "transparent",
    },
    lessonTypeCardSelected: {
        borderColor: colors.background.brandPrimary,
        backgroundColor: colors.background.brandSecondary,
    },
    lessonTypeIcon: {
        fontSize: 32,
        marginBottom: spacing.sm,
    },
    lessonTypeLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.text.primary,
        textAlign: "center",
    },
    lessonTypeLabelSelected: {
        color: colors.background.brandPrimary,
        fontWeight: typography.fontWeight.semibold,
    },
    vehicleCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: spacing.lg,
        backgroundColor: colors.background.secondary,
        borderRadius: radius.xl,
        marginBottom: spacing.md,
        borderWidth: 2,
        borderColor: "transparent",
    },
    vehicleCardSelected: {
        borderColor: colors.background.brandPrimary,
        backgroundColor: colors.background.brandSecondary,
    },
    vehicleInfo: {
        flex: 1,
    },
    vehicleModel: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    vehicleTransmission: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    ownVehicleCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: spacing.lg,
        backgroundColor: colors.background.secondary,
        borderRadius: radius.xl,
        borderWidth: 2,
        borderColor: colors.border.secondary,
        borderStyle: "dashed",
    },
    ownVehicleCardSelected: {
        borderColor: colors.background.brandPrimary,
        backgroundColor: colors.background.brandSecondary,
        borderStyle: "solid",
    },
    ownVehicleInfo: {
        flex: 1,
    },
    ownVehicleTitle: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    ownVehicleDescription: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    footer: {
        flexDirection: "row",
        gap: spacing.md,
        padding: spacing.xl,
        borderTopWidth: 1,
        borderTopColor: colors.border.secondary,
        paddingBottom: Platform.OS === "ios" ? spacing["2xl"] : spacing.xl,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.background.secondary,
        borderRadius: radius.lg,
    },
    backButtonText: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.primary,
    },
    nextButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        paddingVertical: spacing.md,
        backgroundColor: colors.background.brandPrimary,
        borderRadius: radius.lg,
    },
    nextButtonFull: {
        flex: 1,
    },
    nextButtonDisabled: {
        opacity: 0.5,
    },
    nextButtonText: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.white,
    },
});
