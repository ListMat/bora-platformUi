import { View, Text, StyleSheet, TextInput, TextInputProps } from "react-native";
import { colors, spacing, radius, typography } from "@/theme";
import { useState, useEffect } from "react";

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
  // Estado local para o valor formatado exibido
  const [displayValue, setDisplayValue] = useState(formatCPF(value));

  // Sincroniza o valor formatado quando o valor externo muda
  useEffect(() => {
    setDisplayValue(formatCPF(value));
  }, [value]);

  const handleChange = (text: string) => {
    // Atualiza o display imediatamente
    setDisplayValue(text);

    // Remove todos os caracteres não numéricos
    const onlyNumbers = text.replace(/\D/g, "");

    // Limita a 11 dígitos e notifica o pai
    if (onlyNumbers.length <= 11) {
      onChangeText(onlyNumbers);
    }
  };

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
        value={displayValue}
        onChangeText={handleChange}
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
