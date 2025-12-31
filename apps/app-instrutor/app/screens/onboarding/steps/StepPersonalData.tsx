import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface StepPersonalDataProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
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

// Função para formatar telefone
function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 10)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

export default function StepPersonalData({
  data,
  onUpdate,
  onNext,
}: StepPersonalDataProps) {
  const [cpf, setCPF] = useState(data.cpf || "");
  const [phone, setPhone] = useState(data.phone || "");

  const handleNext = () => {
    const cleanCPF = cpf.replace(/\D/g, "");
    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanCPF.length !== 11) {
      Alert.alert("Erro", "CPF deve ter 11 dígitos");
      return;
    }

    if (cleanPhone.length < 10) {
      Alert.alert("Erro", "Telefone inválido");
      return;
    }

    onUpdate({ cpf: cleanCPF, phone: cleanPhone });
    onNext();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="person-outline"
          size={48}
          color={colors.background.brandPrimary}
        />
        <Text style={styles.title}>Dados Pessoais</Text>
        <Text style={styles.subtitle}>
          Preencha seus dados para começar o cadastro
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            CPF <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="000.000.000-00"
            placeholderTextColor={colors.text.tertiary}
            value={formatCPF(cpf)}
            onChangeText={(text) => {
              const numbers = text.replace(/\D/g, "");
              if (numbers.length <= 11) {
                setCPF(numbers);
              }
            }}
            keyboardType="numeric"
            maxLength={14}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Telefone <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="(00) 00000-0000"
            placeholderTextColor={colors.text.tertiary}
            value={formatPhone(phone)}
            onChangeText={(text) => {
              const numbers = text.replace(/\D/g, "");
              if (numbers.length <= 11) {
                setPhone(numbers);
              }
            }}
            keyboardType="phone-pad"
            maxLength={15}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Continuar</Text>
        <Ionicons
          name="arrow-forward"
          size={20}
          color={colors.text.white}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing["3xl"],
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: "center",
  },
  form: {
    marginBottom: spacing.xl,
  },
  inputGroup: {
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
  nextButton: {
    backgroundColor: colors.background.brandPrimary,
    padding: spacing.xl,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing["2xl"],
  },
  nextButtonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});

