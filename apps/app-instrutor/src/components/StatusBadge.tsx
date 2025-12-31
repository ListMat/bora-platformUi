import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";
import { InstructorStatus } from "@bora/db";

interface StatusBadgeProps {
  status: InstructorStatus;
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  PENDING_VERIFICATION: {
    label: "Aguardando Verificação",
    color: colors.background.warning,
    icon: "time-outline" as const,
    textColor: colors.text.warning,
  },
  ACTIVE: {
    label: "Aprovado",
    color: colors.background.success,
    icon: "checkmark-circle" as const,
    textColor: colors.text.success,
  },
  INACTIVE: {
    label: "Inativo",
    color: colors.text.tertiary,
    icon: "pause-circle" as const,
    textColor: colors.text.tertiary,
  },
  SUSPENDED: {
    label: "Suspenso",
    color: colors.background.error,
    icon: "close-circle" as const,
    textColor: colors.text.error,
  },
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];

  const sizeStyles = {
    sm: {
      padding: spacing.xs,
      fontSize: typography.fontSize.xs,
      iconSize: 12,
    },
    md: {
      padding: spacing.sm,
      fontSize: typography.fontSize.sm,
      iconSize: 16,
    },
    lg: {
      padding: spacing.md,
      fontSize: typography.fontSize.base,
      iconSize: 20,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.color,
          padding: currentSize.padding,
        },
      ]}
    >
      <Ionicons
        name={config.icon}
        size={currentSize.iconSize}
        color={config.textColor}
        style={styles.icon}
      />
      <Text
        style={[
          styles.text,
          {
            color: config.textColor,
            fontSize: currentSize.fontSize,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
  icon: {
    marginRight: spacing.xs,
  },
  text: {
    fontWeight: typography.fontWeight.semibold,
  },
});

