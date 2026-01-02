import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface StepPaymentProps {
  formData: {
    paymentMethod: "PIX" | "DINHEIRO" | "DEBITO" | "CREDITO";
    installments: number;
  };
  updateFormData: (data: any) => void;
  instructorId: string;
  onNext: () => void;
}

const PAYMENT_METHODS = [
  {
    id: "PIX" as const,
    title: "Pix",
    subtitle: "Pagar ao final da aula",
    icon: "qr-code-outline",
    recommended: true,
  },
  {
    id: "DINHEIRO" as const,
    title: "Dinheiro",
    subtitle: "Entregar ao instrutor",
    icon: "cash-outline",
    recommended: false,
  },
  {
    id: "DEBITO" as const,
    title: "Cartão de Débito",
    subtitle: "Maquininha do instrutor",
    icon: "card-outline",
    recommended: false,
  },
  {
    id: "CREDITO" as const,
    title: "Cartão de Crédito",
    subtitle: "Parcela em até 3x",
    icon: "card-outline",
    recommended: false,
  },
];

export default function StepPayment({ formData, updateFormData, instructorId, onNext }: StepPaymentProps) {
  const handleSelectMethod = (method: typeof PAYMENT_METHODS[0]["id"]) => {
    updateFormData({ paymentMethod: method });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forma de Pagamento</Text>
      <Text style={styles.subtitle}>Como você quer pagar?</Text>

      <View style={styles.methodsList}>
        {PAYMENT_METHODS.map((method) => {
          const isSelected = formData.paymentMethod === method.id;

          return (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                isSelected && styles.methodCardSelected,
              ]}
              onPress={() => handleSelectMethod(method.id)}
            >
              {/* Icon */}
              <View style={[styles.methodIcon, isSelected && styles.methodIconSelected]}>
                <Ionicons
                  name={method.icon as any}
                  size={28}
                  color={isSelected ? colors.background.brandPrimary : colors.text.secondary}
                />
              </View>

              {/* Info */}
              <View style={styles.methodInfo}>
                <View style={styles.methodHeader}>
                  <Text style={[styles.methodTitle, isSelected && styles.methodTitleSelected]}>
                    {method.title}
                  </Text>
                  {method.recommended && (
                    <View style={styles.recommendedBadge}>
                      <Ionicons name="star" size={10} color={colors.text.white} />
                      <Text style={styles.recommendedText}>Recomendado</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.methodSubtitle, isSelected && styles.methodSubtitleSelected]}>
                  {method.subtitle}
                </Text>
              </View>

              {/* Selection Indicator */}
              <View style={styles.methodAction}>
                {isSelected ? (
                  <Ionicons name="checkmark-circle" size={24} color={colors.background.brandPrimary} />
                ) : (
                  <View style={styles.radioOuter}>
                    <View style={styles.radioInner} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Important Notice */}
      <View style={styles.noticeCard}>
        <View style={styles.noticeIcon}>
          <Ionicons name="shield-checkmark" size={24} color={colors.background.brandPrimary} />
        </View>
        <View style={styles.noticeContent}>
          <Text style={styles.noticeTitle}>Pagamento seguro</Text>
          <Text style={styles.noticeText}>
            O pagamento é realizado SEMPRE ao final da aula, diretamente com o instrutor.
            Você não paga nada agora.
          </Text>
        </View>
      </View>

      {/* Payment Details */}
      {formData.paymentMethod === "PIX" && (
        <View style={styles.detailsCard}>
          <Ionicons name="information-circle-outline" size={20} color={colors.text.tertiary} />
          <Text style={styles.detailsText}>
            Ao final da aula, o instrutor enviará o QR Code do Pix para você pagar na hora
          </Text>
        </View>
      )}

      {formData.paymentMethod === "DINHEIRO" && (
        <View style={styles.detailsCard}>
          <Ionicons name="information-circle-outline" size={20} color={colors.text.tertiary} />
          <Text style={styles.detailsText}>
            Lembre-se de levar o dinheiro trocado para facilitar o pagamento
          </Text>
        </View>
      )}

      {(formData.paymentMethod === "DEBITO" || formData.paymentMethod === "CREDITO") && (
        <View style={styles.detailsCard}>
          <Ionicons name="information-circle-outline" size={20} color={colors.text.tertiary} />
          <Text style={styles.detailsText}>
            O instrutor possui maquininha de cartão para facilitar seu pagamento
          </Text>
        </View>
      )}

      {/* Benefits */}
      <View style={styles.benefitsSection}>
        <Text style={styles.benefitsTitle}>Por que pagar ao final?</Text>

        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.background.brandPrimary} />
            <Text style={styles.benefitText}>Você só paga se a aula acontecer</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.background.brandPrimary} />
            <Text style={styles.benefitText}>Sem risco de chargeback</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.background.brandPrimary} />
            <Text style={styles.benefitText}>Mais segurança para você</Text>
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
  methodsList: {
    gap: spacing.md,
    marginBottom: spacing["3xl"],
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius["2xl"],
    borderWidth: 2,
    borderColor: colors.border.secondary,
    gap: spacing.lg,
  },
  methodCardSelected: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.background.brandPrimary,
  },
  methodIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: colors.background.quaternary,
    justifyContent: "center",
    alignItems: "center",
  },
  methodIconSelected: {
    backgroundColor: colors.background.brandPrimary + "20",
  },
  methodInfo: {
    flex: 1,
  },
  methodHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xxs,
  },
  methodTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  methodTitleSelected: {
    color: colors.text.primary,
  },
  recommendedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.brandPrimary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
    gap: spacing.xxs,
  },
  recommendedText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.white,
    fontWeight: typography.fontWeight.semibold,
  },
  methodSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  methodSubtitleSelected: {
    color: colors.text.secondary,
  },
  methodAction: {
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  noticeCard: {
    flexDirection: "row",
    padding: spacing.lg,
    backgroundColor: colors.background.brandPrimary + "15",
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: colors.background.brandPrimary + "30",
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  noticeIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.background.brandPrimary + "20",
    justifyContent: "center",
    alignItems: "center",
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
  detailsCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: spacing.lg,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    gap: spacing.md,
    marginBottom: spacing["3xl"],
  },
  detailsText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
  benefitsSection: {
    marginBottom: spacing["3xl"],
  },
  benefitsTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  benefitsList: {
    gap: spacing.md,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  benefitText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
});
