import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface ProfileCompletenessProps {
  isComplete: boolean;
  missingFields: string[];
  totalFields: number;
}

const fieldLabels: Record<string, string> = {
  cpf: "CPF",
  dateOfBirth: "Data de Nascimento",
  address: "Endereço",
  city: "Cidade",
  state: "Estado",
  zipCode: "CEP",
  phone: "Telefone",
};

export function ProfileCompleteness({
  isComplete,
  missingFields,
  totalFields,
}: ProfileCompletenessProps) {
  const completedFields = totalFields - missingFields.length;
  const percentage = Math.round((completedFields / totalFields) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name={isComplete ? "checkmark-circle" : "alert-circle"}
          size={24}
          color={isComplete ? colors.text.success : colors.text.warning}
        />
        <Text style={styles.title}>
          {isComplete ? "Perfil Completo" : "Complete seu Perfil"}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${percentage}%`,
                backgroundColor: isComplete
                  ? colors.background.success
                  : colors.background.brandPrimary,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{percentage}% completo</Text>
      </View>

      {!isComplete && missingFields.length > 0 && (
        <View style={styles.missingContainer}>
          <Text style={styles.missingTitle}>Faltam os seguintes dados:</Text>
          {missingFields.map((field) => (
            <View key={field} style={styles.missingItem}>
              <Ionicons
                name="close-circle"
                size={16}
                color={colors.text.error}
              />
              <Text style={styles.missingText}>
                {fieldLabels[field] || field}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.tertiary,
    padding: spacing.xl,
    borderRadius: radius.md,
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: radius.full,
    overflow: "hidden",
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: "100%",
    borderRadius: radius.full,
  },
  progressText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: "right",
  },
  missingContainer: {
    marginTop: spacing.md,
  },
  missingTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  missingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  missingText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
});

