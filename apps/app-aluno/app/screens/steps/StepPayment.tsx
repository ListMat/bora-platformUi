import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface StepPaymentProps {
  formData: any;
  updateFormData: (updates: any) => void;
  instructorId: string;
  onNext: () => void;
}

const PAYMENT_METHODS = [
  {
    id: "PIX" as const,
    label: "Pix",
    subtitle: "Pagar ao final da aula",
    icon: "qr-code",
  },
  {
    id: "DINHEIRO" as const,
    label: "Dinheiro",
    subtitle: "Entregar ao instrutor",
    icon: "cash",
  },
  {
    id: "DEBITO" as const,
    label: "Cartão de débito",
    subtitle: "Maquininha do instrutor",
    icon: "card",
  },
  {
    id: "CREDITO" as const,
    label: "Cartão de crédito",
    subtitle: "Maquininha (parcela em até 3x)",
    icon: "card-outline",
  },
];

export default function StepPayment({
  formData,
  updateFormData,
  instructorId,
  onNext,
}: StepPaymentProps) {
  const selectedMethod = formData.paymentMethod || "PIX";

  const handleSelect = (method: typeof PAYMENT_METHODS[0]["id"]) => {
    updateFormData({ paymentMethod: method });
  };

  const renderMethod = (method: typeof PAYMENT_METHODS[0]) => {
    const isSelected = selectedMethod === method.id;
    return (
      <TouchableOpacity
        style={[styles.methodCard, isSelected && styles.methodCardSelected]}
        onPress={() => handleSelect(method.id)}
      >
        <View style={styles.methodContent}>
          <Ionicons
            name={method.icon as any}
            size={24}
            color={isSelected ? colors.background.brandPrimary : colors.text.secondary}
          />
          <View style={styles.methodInfo}>
            <Text style={[styles.methodLabel, isSelected && styles.methodLabelSelected]}>
              {method.label}
            </Text>
            <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
          </View>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={colors.background.brandPrimary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forma de pagamento</Text>
      <Text style={styles.subtitle}>Você só pagará ao final da aula</Text>

      <View style={styles.methodsList}>
        {PAYMENT_METHODS.map((method) => renderMethod(method))}
      </View>

      <View style={styles.note}>
        <Ionicons name="information-circle" size={20} color={colors.background.brandPrimary} />
        <Text style={styles.noteText}>
          O pagamento será realizado apenas após o término da aula
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
  methodsList: {
    gap: spacing.lg,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.secondary,
    borderRadius: radius["2xl"],
    padding: spacing.xl,
    borderWidth: 2,
    borderColor: "transparent",
  },
  methodCardSelected: {
    backgroundColor: colors.background.tertiary,
    borderColor: colors.background.brandPrimary,
  },
  methodContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    flex: 1,
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  methodLabelSelected: {
    color: colors.background.brandPrimary,
  },
  methodSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  note: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginTop: spacing["3xl"],
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.background.brandPrimary,
  },
  noteText: {
    fontSize: typography.fontSize.sm,
    color: colors.background.brandPrimary,
    flex: 1,
  },
});
