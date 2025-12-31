import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";
import { trpc } from "@/lib/trpc";

interface StepPlanPaymentProps {
  data: {
    planId: string | null;
    paymentMethod: "PIX" | "DINHEIRO" | "DEBITO" | "CREDITO";
    price: number;
  };
  onUpdate: (data: Partial<StepPlanPaymentProps["data"]>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PLANS = [
  { id: "1h", label: "Aula Avulsa", duration: "1 hora", price: 79, icon: "time" },
  { id: "5h", label: "Pacote 5h", duration: "5 horas", price: 350, discount: "R$ 45 de desconto", icon: "star" },
  { id: "10h", label: "Pacote 10h", duration: "10 horas", price: 650, discount: "R$ 140 de desconto", icon: "trophy" },
  { id: "unlimited", label: "Passaporte BORA", duration: "Ilimitado/mês", price: 199, discount: "Melhor custo-benefício", icon: "infinite" },
];

const PAYMENT_METHODS = [
  { id: "PIX", label: "PIX", icon: "flash", description: "Instantâneo" },
  { id: "DINHEIRO", label: "Dinheiro", icon: "cash", description: "Pague ao instrutor" },
  { id: "DEBITO", label: "Débito", icon: "card", description: "À vista" },
  { id: "CREDITO", label: "Crédito", icon: "card-outline", description: "Parcelado" },
];

export default function StepPlanPayment({ data, onUpdate, onNext, onBack }: StepPlanPaymentProps) {
  const selectedPlan = PLANS.find((p) => p.id === data.planId);

  const handlePlanSelect = (planId: string) => {
    const plan = PLANS.find((p) => p.id === planId);
    if (plan) {
      onUpdate({ planId, price: plan.price });
    }
  };

  const handleConfirm = () => {
    if (!data.planId || !data.paymentMethod) {
      Alert.alert("Atenção", "Selecione um plano e forma de pagamento");
      return;
    }
    onNext();
  };

  const isValid = data.planId && data.paymentMethod;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Planos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Escolha seu plano</Text>
        <View style={styles.plansGrid}>
          {PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                data.planId === plan.id && styles.planCardSelected,
              ]}
              onPress={() => handlePlanSelect(plan.id)}
            >
              <View style={styles.planHeader}>
                <Ionicons
                  name={plan.icon as any}
                  size={28}
                  color={
                    data.planId === plan.id
                      ? colors.background.brandPrimary
                      : colors.text.tertiary
                  }
                />
                <View style={styles.planInfo}>
                  <Text style={[
                    styles.planLabel,
                    data.planId === plan.id && styles.planLabelSelected
                  ]}>
                    {plan.label}
                  </Text>
                  <Text style={styles.planDuration}>{plan.duration}</Text>
                </View>
              </View>
              <View style={styles.planPricing}>
                <Text style={[
                  styles.planPrice,
                  data.planId === plan.id && styles.planPriceSelected
                ]}>
                  R$ {plan.price}
                </Text>
                {plan.discount && (
                  <Text style={styles.planDiscount}>{plan.discount}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Forma de Pagamento */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Forma de pagamento</Text>
        <View style={styles.paymentGrid}>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                data.paymentMethod === method.id && styles.paymentCardSelected,
              ]}
              onPress={() => onUpdate({ paymentMethod: method.id as any })}
            >
              <Ionicons
                name={method.icon as any}
                size={24}
                color={
                  data.paymentMethod === method.id
                    ? colors.background.brandPrimary
                    : colors.text.tertiary
                }
              />
              <View style={styles.paymentInfo}>
                <Text style={[
                  styles.paymentLabel,
                  data.paymentMethod === method.id && styles.paymentLabelSelected
                ]}>
                  {method.label}
                </Text>
                <Text style={styles.paymentDescription}>{method.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Resumo */}
      {selectedPlan && (
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Resumo</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{selectedPlan.label}</Text>
            <Text style={styles.summaryValue}>R$ {selectedPlan.price}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotal}>Total</Text>
            <Text style={styles.summaryTotalValue}>R$ {selectedPlan.price}</Text>
          </View>
        </View>
      )}

      {/* Botões */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.confirmButton, !isValid && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={!isValid}
        >
          <Text style={styles.confirmButtonText}>Confirmar</Text>
          <Ionicons name="checkmark" size={20} color={colors.text.white} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
  },
  section: {
    marginBottom: spacing["3xl"],
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  plansGrid: {
    gap: spacing.md,
  },
  planCard: {
    padding: spacing.lg,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border.secondary,
  },
  planCardSelected: {
    borderColor: colors.background.brandPrimary,
    backgroundColor: colors.background.secondary,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  planInfo: {
    flex: 1,
  },
  planLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },
  planLabelSelected: {
    color: colors.text.primary,
  },
  planDuration: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  planPricing: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  planPrice: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.secondary,
  },
  planPriceSelected: {
    color: colors.background.brandPrimary,
  },
  planDiscount: {
    fontSize: typography.fontSize.xs,
    color: colors.background.success,
    fontWeight: typography.fontWeight.medium,
  },
  paymentGrid: {
    gap: spacing.md,
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border.secondary,
    gap: spacing.md,
  },
  paymentCardSelected: {
    borderColor: colors.background.brandPrimary,
    backgroundColor: colors.background.secondary,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },
  paymentLabelSelected: {
    color: colors.text.primary,
  },
  paymentDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  summary: {
    padding: spacing.xl,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
  },
  summaryTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border.secondary,
    marginVertical: spacing.md,
  },
  summaryTotal: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  summaryTotalValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.background.brandPrimary,
  },
  buttons: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing["3xl"],
  },
  backButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  backButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  confirmButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.background.brandPrimary,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.background.disabled,
  },
  confirmButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.white,
  },
});

