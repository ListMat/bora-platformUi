import { View, Text, StyleSheet, Switch } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/theme";
import { useHaptic } from "@/hooks/useHaptic";
import { trpc } from "@/lib/trpc";

interface OnlineToggleProps {
    instructorId: string;
    initialStatus?: boolean;
    onStatusChange?: (isOnline: boolean) => void;
}

export default function OnlineToggle({
    instructorId,
    initialStatus = false,
    onStatusChange,
}: OnlineToggleProps) {
    const haptic = useHaptic();
    const [isOnline, setIsOnline] = useState(initialStatus);

    const toggleOnlineMutation = trpc.instructor.toggleOnline.useMutation();

    useEffect(() => {
        setIsOnline(initialStatus);
    }, [initialStatus]);

    const handleToggle = async (value: boolean) => {
        try {
            haptic.light();
            setIsOnline(value);

            await toggleOnlineMutation.mutateAsync({
                instructorId,
                isOnline: value,
            });

            onStatusChange?.(value);

            if (value) {
                haptic.success();
            }
        } catch (error) {
            console.error("Error toggling online status:", error);
            // Reverter em caso de erro
            setIsOnline(!value);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={[styles.statusDot, isOnline && styles.statusDotOnline]} />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        {isOnline ? "Online" : "Offline"}
                    </Text>
                    <Text style={styles.description}>
                        {isOnline
                            ? "Você está disponível para receber solicitações"
                            : "Você não receberá novas solicitações"}
                    </Text>
                </View>
            </View>

            <Switch
                value={isOnline}
                onValueChange={handleToggle}
                trackColor={{
                    false: colors.border.secondary,
                    true: colors.background.brandPrimary,
                }}
                thumbColor={colors.text.white}
                ios_backgroundColor={colors.border.secondary}
                disabled={toggleOnlineMutation.isLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.background.secondary,
        borderRadius: radius.xl,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.secondary,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        flex: 1,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.text.tertiary,
    },
    statusDotOnline: {
        backgroundColor: colors.background.brandPrimary,
        shadowColor: colors.background.brandPrimary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 3,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    description: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
        lineHeight: 16,
    },
});
