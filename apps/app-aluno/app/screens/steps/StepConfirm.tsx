import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface StepConfirmProps {
  formData: {
    date: Date | null;
    time: string;
    lessonType: string;
    vehicleId: string | null;
    useOwnVehicle: boolean;
    planId: string | null;
    price: number;
    paymentMethod: "PIX" | "DINHEIRO" | "DEBITO" | "CREDITO";
    installments: number;
  };
  updateFormData: (data: any) => void;
  instructorId: string;
  vehicleData?: {
    model: string;
    photo?: string;
  };
  onNext: () => void;
}

const PAYMENT_METHOD_LABELS = {
  PIX: "Pix ao final",
  DINHEIRO: "Dinheiro ao final",
  DEBITO: "Débito ao final",
  CREDITO: "Crédito ao final",
};

export default function StepConfirm({ formData, vehicleData, instructorId, onNext }: StepConfirmProps) {
  const formatDate = () => {
    if (!formData.date) return "";
    return formData.date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "short",
    });
  };

  const getLessonCount = () => {
    if (formData.planId === "1") return "1 aula";
    if (formData.planId === "5") return "5 aulas";
    if (formData.planId === "10") return "10 aulas";
    return "1 aula";
  };

  const getInstallmentText = () => {
    if (formData.installments === 1) {
      return `R$ ${formData.price.toFixed(2)}`;
    }
    const installmentValue = formData.price / formData.installments;
    return `${formData.installments}x R$ ${installmentValue.toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmação</Text>
      <Text style={styles.subtitle}>Revise os detalhes da sua aula</Text>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        {/* Date & Time */}
        <View style={styles.summarySection}>
          <View style={styles.summaryIcon}>
            <Ionicons name="calendar" size={24} color={colors.background.brandPrimary} />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Data e Horário</Text>
            <Text style={styles.summaryValue}>
              {formatDate()}, {formData.time}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Lesson Type */}
        <View style={styles.summarySection}>
          <View style={styles.summaryIcon}>
            <Ionicons name="school" size={24} color={colors.background.brandPrimary} />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Tipo de Aula</Text>
            <Text style={styles.summaryValue}>{formData.lessonType}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Vehicle */}
        <View style={styles.summarySection}>
          <View style={styles.summaryIcon}>
            <Ionicons name="car-sport" size={24} color={colors.background.brandPrimary} />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Veículo</Text>
            <View style={styles.vehicleInfo}>
              {vehicleData?.photo && (
                <Image
                  source={{ uri: vehicleData.photo }}
                  style={styles.vehicleThumbnail}
                  resizeMode="cover"
                />
              )}
              <View>
                <Text style={styles.summaryValue}>
                  {formData.useOwnVehicle ? "Meu carro" : vehicleData?.model || "Carro da autoescola"}
                </Text>
                {formData.useOwnVehicle && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-15% de desconto</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Plan */}
        <View style={styles.summarySection}>
          <View style={styles.summaryIcon}>
            <Ionicons name="pricetag" size={24} color={colors.background.brandPrimary} />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Plano</Text>
            <Text style={styles.summaryValue}>{getLessonCount()}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Payment */}
        <View style={styles.summarySection}>
          <View style={styles.summaryIcon}>
            <Ionicons name="card" size={24} color={colors.background.brandPrimary} />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Forma de Pagamento</Text>
            <Text style={styles.summaryValue}>
              {PAYMENT_METHOD_LABELS[formData.paymentMethod]}
            </Text>
          </View>
        </View>
      </View>

      {/* Total */}
      <View style={styles.totalCard}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Valor Total</Text>
          <Text style={styles.totalValue}>{getInstallmentText()}</Text>
        </View>
        {formData.installments > 1 && (
          <Text style={styles.installmentNote}>
            Sem juros • Pagamento ao final da aula
          </Text>
        )}
      </View>

      {/* Important Notice */}
      <View style={styles.noticeCard}>
        <Ionicons name="shield-checkmark" size={32} color={colors.background.brandPrimary} />
        <View style={styles.noticeContent}>
          <Text style={styles.noticeTitle}>Você só pagará ao final da aula</Text>
          <Text style={styles.noticeText}>
            Nenhum valor será cobrado agora. O pagamento acontece diretamente com o instrutor após a conclusão da aula.
          </Text>
        </View>
      </View>

      {/* Next Steps */}
      <View style={styles.nextStepsCard}>
        <Text style={styles.nextStepsTitle}>Próximos passos</Text>

        <View style={styles.stepsList}>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Instrutor recebe sua solicitação</Text>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Ele tem 2 minutos para aceitar</Text>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Você recebe confirmação no chat</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing["3xl"],
  },
  summaryCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius["2xl"],
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    marginBottom: spacing.lg,
  },
  summarySection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.background.brandPrimary + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginBottom: spacing.xxs,
    textTransform: "uppercase",
    fontWeight: typography.fontWeight.semibold,
  },
  summaryValue: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
    textTransform: "capitalize",
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  vehicleThumbnail: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.background.quaternary,
  },
  discountBadge: {
    backgroundColor: colors.background.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
    marginTop: spacing.xxs,
    alignSelf: "flex-start",
  },
  discountText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.white,
    fontWeight: typography.fontWeight.bold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.secondary,
    marginVertical: spacing.xs,
  },
  totalCard: {
    backgroundColor: colors.background.brandPrimary + "15",
    borderRadius: radius["2xl"],
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.background.brandPrimary + "30",
    marginBottom: spacing.lg,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  totalValue: {
    fontSize: typography.fontSize["2xl"],
    color: colors.background.brandPrimary,
    fontWeight: typography.fontWeight.bold,
  },
  installmentNote: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    textAlign: "right",
  },
  noticeCard: {
    flexDirection: "row",
    padding: spacing.lg,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius["2xl"],
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  noticeText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
  nextStepsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius["2xl"],
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  nextStepsTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  stepsList: {
    gap: spacing.lg,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.background.brandPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.white,
  },
  stepText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
});
