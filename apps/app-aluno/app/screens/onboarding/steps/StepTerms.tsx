import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface StepTermsProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepTerms({ data, onUpdate, onNext, onBack }: StepTermsProps) {
  const [termsAccepted, setTermsAccepted] = useState(data.termsAccepted || false);

  const handleNext = () => {
    if (!termsAccepted) {
      Alert.alert("Atenção", "Você deve aceitar os termos e condições para continuar");
      return;
    }
    onUpdate({ termsAccepted: true });
    onNext();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="document-text-outline" size={48} color={colors.background.brandPrimary} />
        <Text style={styles.title}>Termos e Condições</Text>
        <Text style={styles.subtitle}>Leia e aceite para finalizar</Text>
      </View>

      <ScrollView style={styles.termsContainer} contentContainerStyle={styles.termsContent}>
        <Text style={styles.termsTitle}>Termos de Uso e Política de Privacidade</Text>
        <Text style={styles.termsText}>
          Ao usar o BORA, você concorda com os seguintes termos:
        </Text>
        <Text style={styles.termsText}>
          • Você deve ter pelo menos 18 anos para usar o aplicativo{'\n'}
          • Você é responsável por fornecer informações precisas{'\n'}
          • Você concorda em seguir todas as leis de trânsito{'\n'}
          • Você autoriza o uso de sua localização durante as aulas{'\n'}
          • Você concorda com nossa política de privacidade
        </Text>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => Linking.openURL("https://bora.com/terms")}
        >
          <Text style={styles.linkText}>Ler termos completos</Text>
          <Ionicons name="open-outline" size={16} color={colors.background.brandPrimary} />
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => {
          setTermsAccepted(!termsAccepted);
          onUpdate({ termsAccepted: !termsAccepted });
        }}
      >
        <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
          {termsAccepted && (
            <Ionicons name="checkmark" size={20} color={colors.text.white} />
          )}
        </View>
        <Text style={styles.checkboxLabel}>
          Eu aceito os termos e condições
        </Text>
      </TouchableOpacity>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, !termsAccepted && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!termsAccepted}
        >
          <Text style={styles.nextButtonText}>Finalizar Cadastro</Text>
          <Ionicons name="checkmark" size={20} color={colors.text.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: "center", marginBottom: spacing.xl },
  title: { fontSize: typography.fontSize["2xl"], fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginTop: spacing.lg, marginBottom: spacing.sm },
  subtitle: { fontSize: typography.fontSize.base, color: colors.text.secondary, textAlign: "center" },
  termsContainer: { flex: 1, backgroundColor: colors.background.tertiary, borderRadius: radius.md, padding: spacing.xl, marginBottom: spacing.xl },
  termsContent: { paddingBottom: spacing.md },
  termsTitle: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md },
  termsText: { fontSize: typography.fontSize.sm, color: colors.text.secondary, lineHeight: 20, marginBottom: spacing.sm },
  linkButton: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: spacing.md },
  linkText: { fontSize: typography.fontSize.sm, color: colors.background.brandPrimary, fontWeight: typography.fontWeight.medium },
  checkboxContainer: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.xl },
  checkbox: { width: 24, height: 24, borderRadius: radius.sm, borderWidth: 2, borderColor: colors.border.secondary, alignItems: "center", justifyContent: "center" },
  checkboxChecked: { backgroundColor: colors.background.brandPrimary, borderColor: colors.background.brandPrimary },
  checkboxLabel: { flex: 1, fontSize: typography.fontSize.base, color: colors.text.primary },
  buttons: { flexDirection: "row", gap: spacing.md },
  backButton: { flex: 1, padding: spacing.xl, borderRadius: radius.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.background.tertiary, borderWidth: 1, borderColor: colors.border.secondary },
  backButtonText: { color: colors.text.primary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold },
  nextButton: { flex: 1, backgroundColor: colors.background.success, padding: spacing.xl, borderRadius: radius.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm },
  nextButtonDisabled: { opacity: 0.5 },
  nextButtonText: { color: colors.text.white, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold },
});

