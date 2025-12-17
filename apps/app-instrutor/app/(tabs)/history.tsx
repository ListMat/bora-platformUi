import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "@/theme";

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Aulas</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Aulas Totais</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0.0</Text>
          <Text style={styles.statLabel}>Avaliação Média</Text>
        </View>
      </View>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Nenhuma aula no histórico</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing['2xl'],
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xl,
    color: colors.text.primary,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing['3xl'],
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    padding: spacing.xl,
    borderRadius: radius.md,
    alignItems: "center",
  },
  statValue: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.background.brandPrimary,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
  },
});

