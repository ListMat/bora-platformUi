import { View, Text, StyleSheet, TextInput, TextInputProps } from "react-native";
import { colors, spacing, radius, typography } from "@/theme";

interface CPFInputProps extends Omit<TextInputProps, "value" | "onChangeText"> {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
}

// Função para formatar CPF
function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6)
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9)
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
}

export function CPFInput({
  value,
  onChangeText,
  error,
  label,
  required = false,
  ...props
}: CPFInputProps) {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        {...props}
        style={[styles.input, error && styles.inputError]}
        placeholder="000.000.000-00"
        placeholderTextColor={colors.text.tertiary}
        value={formatCPF(value)}
        onChangeText={(text) => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'CPFInput.tsx:onChangeText', message: 'CPF input changed', data: { text, textLength: text.length, formatted: formatCPF(text) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
          // #endregion
          // Remover tudo que não é número
          const numbers = text.replace(/\D/g, "");
          // Permitir até 11 dígitos (CPF completo)
          onChangeText(numbers.slice(0, 11));
        }}
        keyboardType="numeric"
        maxLength={14} // 000.000.000-00 (14 caracteres com formatação)
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.text.error,
  },
  input: {
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  inputError: {
    borderColor: colors.border.error,
  },
  error: {
    fontSize: typography.fontSize.xs,
    color: colors.text.error,
    marginTop: spacing.xs,
  },
});

