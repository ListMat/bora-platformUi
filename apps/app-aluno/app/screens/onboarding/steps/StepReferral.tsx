import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface StepReferralProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepReferral({ data, onUpdate, onNext, onBack }: StepReferralProps) {
  const [referralCode, setReferralCode] = useState(data.referralCode || "");

  const handleNext = () => {
    onUpdate({ referralCode: referralCode.trim().toUpperCase() || undefined });
    onNext();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="gift-outline" size={48} color={colors.background.brandPrimary} />
        <Text style={styles.title}>Código de Indicação</Text>
        <Text style={styles.subtitle}>Tem um código de indicação? (opcional)</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Código de Indicação</Text>
          <TextInput
            style={styles.input}
            placeholder="ABC123"
            placeholderTextColor={colors.text.tertiary}
            value={referralCode}
            onChangeText={(text) => setReferralCode(text.toUpperCase().slice(0, 6))}
            maxLength={6}
            autoCapitalize="characters"
          />
          <Text style={styles.hint}>
            Digite o código de 6 caracteres se você foi indicado por alguém
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={colors.background.brandPrimary} />
          <Text style={styles.infoText}>
            Ao usar um código de indicação, você e quem te indicou ganham pontos!
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
  input: { backgroundColor: colors.background.tertiary, borderRadius: radius.md, padding: spacing.lg, fontSize: typography.fontSize["2xl"], color: colors.text.primary, borderWidth: 1, borderColor: colors.border.secondary, textAlign: "center", fontWeight: typography.fontWeight.bold, letterSpacing: 4 },
  hint: { fontSize: typography.fontSize.xs, color: colors.text.tertiary, marginTop: spacing.xs, textAlign: "center" },
  infoCard: { backgroundColor: colors.background.brandPrimary + "20", padding: spacing.xl, borderRadius: radius.md, flexDirection: "row", alignItems: "flex-start", gap: spacing.md, borderWidth: 1, borderColor: colors.background.brandPrimary },
  infoText: { flex: 1, fontSize: typography.fontSize.sm, color: colors.text.secondary, lineHeight: 20 },
  buttons: { flexDirection: "row", gap: spacing.md, marginTop: spacing["2xl"] },
  backButton: { flex: 1, padding: spacing.xl, borderRadius: radius.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.background.tertiary, borderWidth: 1, borderColor: colors.border.secondary },
  backButtonText: { color: colors.text.primary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold },
  nextButton: { flex: 1, backgroundColor: colors.background.brandPrimary, padding: spacing.xl, borderRadius: radius.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm },
  nextButtonText: { color: colors.text.white, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold },
});

