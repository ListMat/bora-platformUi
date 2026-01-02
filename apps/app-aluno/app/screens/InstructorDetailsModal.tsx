import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Modal,
    Dimensions,
    Platform,
} from "react-native";
import { useState, useMemo } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/theme";
import { trpc } from "@/lib/trpc";
import { useHaptic } from "@/hooks/useHaptic";
import { format, addHours, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const { width, height } = Dimensions.get("window");

interface Instructor {
    id: string;
    user: {
        name: string | null;
        image: string | null;
        emailVerified: Date | null;
    };
    bio?: string | null;
    latitude: number | null;
    longitude: number | null;
    averageRating: number | null;
    totalLessons: number | null;
    basePrice: number | null;
    city?: string | null;
    state?: string | null;
    credentialNumber?: string | null;
    acceptsOwnVehicle?: boolean;
    vehicles?: Array<{
        id: string;
        brand: string;
        model: string;
        year: number | null;
        transmission: string;
        hasDualPedal: boolean;
        photoUrl: string | null;
    }>;
}

interface InstructorDetailsModalProps {
    visible: boolean;
    instructor: Instructor | null;
    onClose: () => void;
}

export default function InstructorDetailsModal({
    visible,
    instructor,
    onClose,
}: InstructorDetailsModalProps) {
    const router = useRouter();
    const haptic = useHaptic();

    // Buscar horários disponíveis hoje
    const today = useMemo(() => new Date(), []);
    const { data: slotsData } = trpc.instructor.slots.useQuery(
        {
            instructorId: instructor?.id || "",
            date: today,
        },
        { enabled: !!instructor?.id && visible }
    );

    // Buscar veículos do instrutor
    const { data: vehiclesData } = trpc.instructor.vehicles.useQuery(
        { instructorId: instructor?.id || "" },
        { enabled: !!instructor?.id && visible }
    );

    // Planos fixos
    const plans = [
        { id: "1", lessons: 1, price: 79, discount: 0, tag: null },
        { id: "5", lessons: 5, price: 355, originalPrice: 395, discount: 10, tag: "-10%" },
        { id: "10", lessons: 10, price: 672, originalPrice: 790, discount: 15, tag: "-15%" },
    ];

    const handleSolicitarAula = () => {
        haptic.medium();
        onClose();
        router.push({
            pathname: "/screens/SolicitarAulaFlow",
            params: { instructorId: instructor?.id },
        });
    };

    if (!instructor) return null;

    const vehicles = vehiclesData || instructor.vehicles || [];
    const availableSlots = slotsData?.slots?.filter((s) => s.available) || [];

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
                        }}
                        accessibilityLabel="Fechar"
                        accessibilityRole="button"
                    >
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header: Foto + Nome + Nota + Credencial */}
                    <View style={styles.instructorHeader}>
                        {instructor.user.image ? (
                            <Image
                                source={{ uri: instructor.user.image }}
                                style={styles.instructorPhoto}
                            />
                        ) : (
                            <View style={styles.instructorPhotoPlaceholder}>
                                <Ionicons name="person" size={48} color={colors.text.tertiary} />
                            </View>
                        )}

                        <View style={styles.instructorInfo}>
                            <View style={styles.nameRow}>
                                <Text style={styles.instructorName}>
                                    {instructor.user.name || "Instrutor"}
                                </Text>
                                {instructor.user.emailVerified && (
                                    <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                                )}
                            </View>

                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Text style={styles.rating}>
                                    {instructor.averageRating?.toFixed(1) || "0.0"}
                                </Text>
                                <Text style={styles.totalLessons}>
                                    ({instructor.totalLessons || 0} aulas)
                                </Text>
                            </View>

                            {instructor.credentialNumber && instructor.state && (
                                <View style={styles.credentialBadge}>
                                    <Ionicons name="shield-checkmark" size={14} color={colors.background.brandPrimary} />
                                    <Text style={styles.credentialText}>
                                        Credencial DETRAN-{instructor.state}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Sobre (Bio) */}
                    {instructor.bio && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="document-text-outline" size={20} color={colors.text.secondary} />
                                <Text style={styles.sectionTitle}>Sobre</Text>
                            </View>
                            <Text style={styles.bioText}>{instructor.bio}</Text>
                        </View>
                    )}

                    {/* Veículos */}
                    {vehicles.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="car-sport-outline" size={20} color={colors.text.secondary} />
                                <Text style={styles.sectionTitle}>Veículos</Text>
                            </View>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.vehiclesScroll}
                            >
                                {vehicles.map((vehicle) => (
                                    <View key={vehicle.id} style={styles.vehicleCard}>
                                        {vehicle.photoUrl ? (
                                            <Image
                                                source={{ uri: vehicle.photoUrl }}
                                                style={styles.vehicleImage}
                                            />
                                        ) : (
                                            <View style={styles.vehicleImagePlaceholder}>
                                                <Ionicons name="car" size={32} color={colors.text.tertiary} />
                                            </View>
                                        )}
                                        <Text style={styles.vehicleModel}>
                                            {vehicle.brand} {vehicle.model}
                                        </Text>
                                        <Text style={styles.vehicleTransmission}>
                                            {vehicle.transmission === "AUTOMATIC" ? "Automático" : "Manual"}
                                        </Text>
                                        {vehicle.hasDualPedal && (
                                            <View style={styles.dualPedalBadge}>
                                                <Text style={styles.dualPedalText}>Duplo-pedal</Text>
                                            </View>
                                        )}
                                    </View>
                                ))}
                                {instructor.acceptsOwnVehicle && (
                                    <View style={[styles.vehicleCard, styles.ownVehicleCard]}>
                                        <View style={styles.ownVehicleIcon}>
                                            <Ionicons name="car-outline" size={32} color={colors.background.brandPrimary} />
                                        </View>
                                        <Text style={styles.ownVehicleTitle}>Aceita seu carro</Text>
                                        <Text style={styles.ownVehicleDiscount}>-15% de desconto</Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    )}

                    {/* Pacotes */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="pricetag-outline" size={20} color={colors.text.secondary} />
                            <Text style={styles.sectionTitle}>Pacotes</Text>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.plansScroll}
                        >
                            {plans.map((plan) => (
                                <View key={plan.id} style={styles.planCard}>
                                    {plan.tag && (
                                        <View style={styles.planTag}>
                                            <Text style={styles.planTagText}>{plan.tag}</Text>
                                        </View>
                                    )}
                                    <Text style={styles.planLessons}>{plan.lessons} aula{plan.lessons > 1 ? "s" : ""}</Text>
                                    <Text style={styles.planPrice}>R$ {plan.price}</Text>
                                    {plan.originalPrice && (
                                        <Text style={styles.planOriginalPrice}>R$ {plan.originalPrice}</Text>
                                    )}
                                    <Text style={styles.planPerLesson}>
                                        R$ {(plan.price / plan.lessons).toFixed(0)}/aula
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Horários Disponíveis Hoje */}
                    {availableSlots.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="time-outline" size={20} color={colors.text.secondary} />
                                <Text style={styles.sectionTitle}>Disponível hoje</Text>
                            </View>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.slotsScroll}
                            >
                                {availableSlots.slice(0, 8).map((slot, index) => (
                                    <View key={index} style={styles.slotPill}>
                                        <Text style={styles.slotTime}>{slot.time}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Localidade */}
                    {(instructor.city || instructor.state) && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="location-outline" size={20} color={colors.text.secondary} />
                                <Text style={styles.sectionTitle}>Localidade</Text>
                            </View>
                            <Text style={styles.locationText}>
                                {instructor.city && instructor.state
                                    ? `${instructor.city}, ${instructor.state}`
                                    : instructor.city || instructor.state}
                            </Text>
                        </View>
                    )}

                    {/* Espaço para o botão fixo */}
                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Botão Fixo */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.solicitarButton}
                        onPress={handleSolicitarAula}
                        activeOpacity={0.8}
                        accessibilityLabel="Solicitar aula"
                        accessibilityRole="button"
                    >
                        <Text style={styles.solicitarButtonText}>Solicitar Aula</Text>
                        <Ionicons name="arrow-forward" size={20} color={colors.text.white} />
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing["4xl"],
    },
    instructorHeader: {
        flexDirection: "row",
        padding: spacing.xl,
        gap: spacing.lg,
    },
    instructorPhoto: {
        width: 80,
        height: 80,
        borderRadius: radius["2xl"],
    },
    instructorPhotoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: radius["2xl"],
        backgroundColor: colors.background.tertiary,
        justifyContent: "center",
        alignItems: "center",
    },
    instructorInfo: {
        flex: 1,
        justifyContent: "center",
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        marginBottom: spacing.xs,
    },
    instructorName: {
        fontSize: typography.fontSize["2xl"],
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        marginBottom: spacing.sm,
    },
    rating: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
    },
    totalLessons: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    credentialBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        backgroundColor: colors.background.brandSecondary,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.md,
        alignSelf: "flex-start",
    },
    credentialText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        color: colors.background.brandPrimary,
    },
    section: {
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
    },
    bioText: {
        fontSize: typography.fontSize.base,
        lineHeight: 24,
        color: colors.text.secondary,
    },
    vehiclesScroll: {
        gap: spacing.md,
    },
    vehicleCard: {
        width: 160,
        backgroundColor: colors.background.secondary,
        borderRadius: radius.xl,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.secondary,
    },
    vehicleImage: {
        width: "100%",
        height: 100,
        borderRadius: radius.lg,
        marginBottom: spacing.sm,
    },
    vehicleImagePlaceholder: {
        width: "100%",
        height: 100,
        borderRadius: radius.lg,
        backgroundColor: colors.background.tertiary,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: spacing.sm,
    },
    vehicleModel: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    vehicleTransmission: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
    },
    dualPedalBadge: {
        backgroundColor: colors.background.brandSecondary,
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
        borderRadius: radius.sm,
        alignSelf: "flex-start",
    },
    dualPedalText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        color: colors.background.brandPrimary,
    },
    ownVehicleCard: {
        borderColor: colors.background.brandPrimary,
        borderWidth: 2,
        borderStyle: "dashed",
    },
    ownVehicleIcon: {
        width: "100%",
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: spacing.sm,
    },
    ownVehicleTitle: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    ownVehicleDiscount: {
        fontSize: typography.fontSize.xs,
        color: colors.background.brandPrimary,
        fontWeight: typography.fontWeight.medium,
    },
    plansScroll: {
        gap: spacing.md,
    },
    planCard: {
        width: 120,
        backgroundColor: colors.background.secondary,
        borderRadius: radius.xl,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.secondary,
        position: "relative",
    },
    planTag: {
        position: "absolute",
        top: -8,
        right: 8,
        backgroundColor: colors.background.brandPrimary,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: radius.md,
    },
    planTagText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.white,
    },
    planLessons: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
    },
    planPrice: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    planOriginalPrice: {
        fontSize: typography.fontSize.sm,
        color: colors.text.tertiary,
        textDecorationLine: "line-through",
        marginBottom: spacing.xs,
    },
    planPerLesson: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
    },
    slotsScroll: {
        gap: spacing.sm,
    },
    slotPill: {
        backgroundColor: colors.background.brandSecondary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.background.brandPrimary,
    },
    slotTime: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.background.brandPrimary,
    },
    locationText: {
        fontSize: typography.fontSize.base,
        color: colors.text.secondary,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.xl,
        backgroundColor: colors.background.primary,
        borderTopWidth: 1,
        borderTopColor: colors.border.secondary,
        paddingBottom: Platform.OS === "ios" ? spacing["2xl"] : spacing.xl,
    },
    solicitarButton: {
        backgroundColor: colors.background.brandPrimary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        paddingVertical: spacing.lg,
        borderRadius: radius.xl,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    solicitarButtonText: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.white,
    },
});
