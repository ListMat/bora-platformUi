import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/theme";
import { differenceInSeconds } from "date-fns";

interface ChatTimerProps {
    expiresAt: Date;
    onExpire?: () => void;
}

export default function ChatTimer({ expiresAt, onExpire }: ChatTimerProps) {
    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const seconds = differenceInSeconds(expiresAt, now);

            if (seconds <= 0) {
                setTimeRemaining(0);
                onExpire?.();
            } else {
                setTimeRemaining(seconds);
            }
        };

        // Atualizar imediatamente
        updateTimer();

        // Atualizar a cada segundo
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, onExpire]);

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    const isUrgent = timeRemaining <= 30; // Últimos 30 segundos
    const isExpired = timeRemaining <= 0;

    if (isExpired) {
        return (
            <View style={[styles.container, styles.expiredContainer]}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                <Text style={styles.expiredText}>Tempo esgotado</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, isUrgent && styles.urgentContainer]}>
            <Ionicons
                name="time-outline"
                size={16}
                color={isUrgent ? "#F59E0B" : colors.text.secondary}
            />
            <Text style={[styles.timerText, isUrgent && styles.urgentText]}>
                {minutes}:{seconds.toString().padStart(2, "0")}
            </Text>
            {isUrgent && (
                <View style={styles.urgentBadge}>
                    <Text style={styles.urgentBadgeText}>Urgente!</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        backgroundColor: colors.background.secondary,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border.secondary,
    },
    urgentContainer: {
        backgroundColor: "#FEF3C7",
        borderColor: "#F59E0B",
    },
    expiredContainer: {
        backgroundColor: "#FEE2E2",
        borderColor: "#EF4444",
    },
    timerText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.secondary,
        fontVariant: ["tabular-nums"],
    },
    urgentText: {
        color: "#F59E0B",
    },
    expiredText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: "#EF4444",
    },
    urgentBadge: {
        backgroundColor: "#F59E0B",
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
        borderRadius: radius.sm,
    },
    urgentBadgeText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.white,
    },
});
