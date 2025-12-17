import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface StepConfirmProps {
  formData: any;
  updateFormData: (updates: any) => void;
  instructorId: string;
  onNext: () => void;
}

export default function StepConfirm({
  formData,
  updateFormData,
  instructorId,
  onNext,
}: StepConfirmProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const paymentMethodLabel = {
    PIX: "Pix",
    DINHEIRO: "Dinheiro",
    DEBITO: "Cartão de débito",
    CREDITO: "Cartão de crédito",
  }[formData.paymentMethod];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirme sua solicitação</Text>
      <Text style={styles.subtitle}>Revise os detalhes antes de confirmar</Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Ionicons name="calendar" size={20} color={colors.background.brandPrimary} />
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Data e Horário</Text>
            <Text style={styles.summaryValue}>
              {formatDate(formData.date)}, {formatTime(formData.time)}
            </Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <Ionicons name="school" size={20} color={colors.background.brandPrimary} />
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Tipo de Aula</Text>
            <Text style={styles.summaryValue}>{formData.lessonType}</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <Ionicons name="car" size={20} color={colors.background.brandPrimary} />
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Veículo</Text>
            <Text style={styles.summaryValue}>
              {formData.useOwnVehicle ? "Meu carro" : "Carro da autoescola"}
            </Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <Ionicons name="document-text" size={20} color={colors.background.brandPrimary} />
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Plano</Text>
            <Text style={styles.summaryValue}>
              {formData.planId === "1"
                ? "1 aula"
                : formData.planId === "5"
                ? "5 aulas"
                : formData.planId === "10"
                ? "10 aulas"
                : "1 aula"}
            </Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <Ionicons name="card" size={20} color={colors.background.brandPrimary} />
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Pagamento</Text>
            <Text style={styles.summaryValue}>
              {paymentMethodLabel} ao final
            </Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Valor</Text>
          <Text style={styles.priceValue}>R$ {formData.price.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.finalNote}>
        <Ionicons name="information-circle" size={20} color={colors.background.brandPrimary} />
        <Text style={styles.finalNoteText}>
          Após confirmar, você será direcionado para o chat com o instrutor para aguardar a aprovação.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing["3xl"],
  },
  summaryCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius["2xl"],
    padding: spacing["2xl"],
    marginBottom: spacing["3xl"],
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing["2xl"],
    gap: spacing.lg,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border.secondary,
    marginTop: spacing.sm,
  },
  priceLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  priceValue: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.background.brandPrimary,
  },
  finalNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.background.tertiary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.background.brandPrimary,
  },
  finalNoteText: {
    fontSize: typography.fontSize.sm,
    color: colors.background.brandPrimary,
    flex: 1,
    lineHeight: 20,
  },
});
