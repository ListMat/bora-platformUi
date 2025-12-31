import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, spacing, radius, typography } from "@/theme";
import { CPFInput } from "@/components/CPFInput";

interface StepPersonalDataProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

export default function StepPersonalData({
  data,
  onUpdate,
  onNext,
}: StepPersonalDataProps) {
  const [cpf, setCPF] = useState(data.cpf || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    data.dateOfBirth || new Date(2000, 0, 1)
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleNext = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'StepPersonalData.tsx:handleNext:entry',message:'Step 1 next button pressed',data:{cpf,cpfLength:cpf.length,dateOfBirth:dateOfBirth.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    const cleanCPF = cpf.replace(/\D/g, "");

    if (cleanCPF.length !== 11) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'StepPersonalData.tsx:handleNext:cpf-error',message:'CPF validation failed',data:{cleanCPF,cleanCPFLength:cleanCPF.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      Alert.alert("Erro", "CPF deve ter 11 dígitos");
      return;
    }

    // Validar idade mínima (18 anos)
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      actualAge = age - 1;
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'StepPersonalData.tsx:handleNext:age-check',message:'Age validation',data:{actualAge,dateOfBirth:dateOfBirth.toISOString(),today:today.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    if (actualAge < 18) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'StepPersonalData.tsx:handleNext:age-error',message:'Age validation failed',data:{actualAge},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      Alert.alert("Erro", "Você deve ter pelo menos 18 anos para dirigir");
      return;
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'StepPersonalData.tsx:handleNext:success',message:'Step 1 validation passed',data:{cleanCPF,dateOfBirth:dateOfBirth.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    onUpdate({ cpf: cleanCPF, dateOfBirth });
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
          Preencha seus dados para começar
        </Text>
      </View>

      <View style={styles.form}>
        <CPFInput
          label="CPF"
          value={cpf}
          onChangeText={setCPF}
          required
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Data de Nascimento <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {dateOfBirth.toLocaleDateString("pt-BR")}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={colors.text.primary} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={new Date(2006, 11, 31)} // 18 anos atrás
              onChange={(event, date) => {
                if (Platform.OS === "android") {
                  setShowDatePicker(false);
                }
                if (date) setDateOfBirth(date);
              }}
            />
          )}
          <Text style={styles.hint}>Você deve ter pelo menos 18 anos</Text>
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
  dateButton: {
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.md,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  dateText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  hint: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
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

