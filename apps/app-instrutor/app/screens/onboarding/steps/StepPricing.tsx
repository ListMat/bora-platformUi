import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface StepPricingProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepPricing({ data, onUpdate, onNext, onBack }: StepPricingProps) {
  const [basePrice, setBasePrice] = useState(data.basePrice?.toString() || "100");

  const handleNext = () => {
    const price = parseFloat(basePrice.replace(",", "."));
    if (isNaN(price) || price < 50) {
      Alert.alert("Erro", "Preço mínimo é R$ 50,00");
      return;
    }
    if (price > 1000) {
      Alert.alert("Erro", "Preço máximo é R$ 1.000,00");
      return;
    }
    onUpdate({ basePrice: price });
    onNext();
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    const amount = parseFloat(numbers) / 100;
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="cash-outline" size={48} color={colors.background.brandPrimary} />
        <Text style={styles.title}>Preço Base</Text>
        <Text style={styles.subtitle}>Defina o valor da sua aula</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preço por aula <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="R$ 100,00"
            placeholderTextColor={colors.text.tertiary}
            value={basePrice}
            onChangeText={(text) => {
              const numbers = text.replace(/\D/g, "");
              if (numbers) {
                const amount = parseFloat(numbers) / 100;
                setBasePrice(amount.toFixed(2));
              } else {
                setBasePrice("");
              }
            }}
            keyboardType="numeric"
          />
          <Text style={styles.hint}>Valor mínimo: R$ 50,00 | Valor máximo: R$ 1.000,00</Text>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Seu preço</Text>
          <Text style={styles.priceValue}>
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(parseFloat(basePrice) || 0)}
          </Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Continuar</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.text.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: "center", marginBottom: spacing["3xl"] },
  title: { fontSize: typography.fontSize["2xl"], fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginTop: spacing.lg, marginBottom: spacing.sm },
  subtitle: { fontSize: typography.fontSize.base, color: colors.text.secondary, textAlign: "center" },
  form: { marginBottom: spacing.xl },
  inputGroup: { marginBottom: spacing.xl },
  label: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary, marginBottom: spacing.sm },
  required: { color: colors.text.error },
  input: { backgroundColor: colors.background.tertiary, borderRadius: radius.md, padding: spacing.lg, fontSize: typography.fontSize["2xl"], color: colors.text.primary, borderWidth: 1, borderColor: colors.border.secondary, fontWeight: typography.fontWeight.bold },
  hint: { fontSize: typography.fontSize.xs, color: colors.text.tertiary, marginTop: spacing.xs },
  priceCard: { backgroundColor: colors.background.brandPrimary + "20", padding: spacing.xl, borderRadius: radius.md, alignItems: "center", borderWidth: 1, borderColor: colors.background.brandPrimary },
  priceLabel: { fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs },
  priceValue: { fontSize: typography.fontSize["3xl"], fontWeight: typography.fontWeight.bold, color: colors.background.brandPrimary },
  buttons: { flexDirection: "row", gap: spacing.md, marginTop: spacing["2xl"] },
  backButton: { flex: 1, padding: spacing.xl, borderRadius: radius.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.background.tertiary, borderWidth: 1, borderColor: colors.border.secondary },
  backButtonText: { color: colors.text.primary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold },
  nextButton: { flex: 1, backgroundColor: colors.background.brandPrimary, padding: spacing.xl, borderRadius: radius.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm },
  nextButtonText: { color: colors.text.white, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold },
});

