import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/theme";
import { useHaptic } from "@/hooks/useHaptic";

interface QuickReplyButtonsProps {
    onAccept: () => void;
    onReschedule: () => void;
    onReject: () => void;
    disabled?: boolean;
}

export default function QuickReplyButtons({
    onAccept,
    onReschedule,
    onReject,
    disabled = false,
}: QuickReplyButtonsProps) {
    const haptic = useHaptic();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Responder solicitação</Text>

            <View style={styles.buttonsRow}>
                {/* Botão Aceitar (Verde) */}
                <TouchableOpacity
                    style={[styles.button, styles.acceptButton, disabled && styles.buttonDisabled]}
                    onPress={() => {
                        haptic.medium();
                        onAccept();
                    }}
                    disabled={disabled}
                    activeOpacity={0.8}
                    accessibilityLabel="Aceitar solicitação"
                    accessibilityRole="button"
                >
                    <Ionicons name="checkmark-circle" size={20} color={colors.text.white} />
                    <Text style={styles.acceptButtonText}>Aceitar</Text>
                </TouchableOpacity>

                {/* Botão Trocar Horário */}
                <TouchableOpacity
                    style={[styles.button, styles.rescheduleButton, disabled && styles.buttonDisabled]}
                    onPress={() => {
                        haptic.light();
                        onReschedule();
                    }}
                    disabled={disabled}
                    activeOpacity={0.8}
                    accessibilityLabel="Trocar horário"
                    accessibilityRole="button"
                >
                    <Ionicons name="calendar-outline" size={18} color={colors.text.primary} />
                    <Text style={styles.rescheduleButtonText}>Trocar horário</Text>
                </TouchableOpacity>

                {/* Botão Recusar (Cinza) */}
                <TouchableOpacity
                    style={[styles.button, styles.rejectButton, disabled && styles.buttonDisabled]}
                    onPress={() => {
                        haptic.light();
                        onReject();
                    }}
                    disabled={disabled}
                    activeOpacity={0.8}
                    accessibilityLabel="Recusar solicitação"
                    accessibilityRole="button"
                >
                    <Ionicons name="close-circle-outline" size={18} color={colors.text.secondary} />
                    <Text style={styles.rejectButtonText}>Recusar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background.secondary,
        padding: spacing.lg,
        borderRadius: radius.xl,
        marginVertical: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.secondary,
    },
    title: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.secondary,
        marginBottom: spacing.md,
        textAlign: "center",
    },
    buttonsRow: {
        gap: spacing.sm,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.xs,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    // Botão Aceitar (Verde)
    acceptButton: {
        backgroundColor: colors.background.brandPrimary,
        borderColor: colors.background.brandPrimary,
    },
    acceptButtonText: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.white,
    },
    // Botão Trocar Horário
    rescheduleButton: {
        backgroundColor: colors.background.tertiary,
        borderColor: colors.border.secondary,
    },
    rescheduleButtonText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.primary,
    },
    // Botão Recusar (Cinza)
    rejectButton: {
        backgroundColor: "transparent",
        borderColor: colors.border.secondary,
    },
    rejectButtonText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.secondary,
    },
});
