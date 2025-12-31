import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, spacing, radius, typography } from "@/theme";
import { DocumentUpload } from "@/components/DocumentUpload";

interface StepDocumentsProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

function formatCNH(value: string): string {
  const numbers = value.replace(/\D/g, "");
  return numbers.slice(0, 11);
}

export default function StepDocuments({ data, onUpdate, onNext, onBack }: StepDocumentsProps) {
  const [cnhNumber, setCNHNumber] = useState(data.cnhNumber || "");
  const [credentialNumber, setCredentialNumber] = useState(data.credentialNumber || "");
  const [credentialExpiry, setCredentialExpiry] = useState(data.credentialExpiry || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cnhDocument, setCNHDocument] = useState(data.cnhDocument);
  const [credentialDocument, setCredentialDocument] = useState(data.credentialDocument);

  const handleCNHUpload = async (base64: string, filename: string) => {
    try {
      setCNHDocument(base64);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  const handleCredentialUpload = async (base64: string, filename: string) => {
    try {
      setCredentialDocument(base64);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  const handleNext = () => {
    if (cnhNumber.replace(/\D/g, "").length !== 11) {
      Alert.alert("Erro", "CNH deve ter 11 dígitos");
      return;
    }
    if (!credentialNumber.trim()) {
      Alert.alert("Erro", "Número da credencial é obrigatório");
      return;
    }
    if (credentialExpiry <= new Date()) {
      Alert.alert("Erro", "Data de validade deve ser futura");
      return;
    }

    onUpdate({
      cnhNumber: cnhNumber.replace(/\D/g, ""),
      credentialNumber: credentialNumber.trim(),
      credentialExpiry,
      cnhDocument,
      credentialDocument,
    });
    onNext();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="document-text-outline" size={48} color={colors.background.brandPrimary} />
        <Text style={styles.title}>Documentos</Text>
        <Text style={styles.subtitle}>Envie seus documentos para verificação</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>CNH <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="00000000000"
            placeholderTextColor={colors.text.tertiary}
            value={formatCNH(cnhNumber)}
            onChangeText={(text) => {
              const numbers = text.replace(/\D/g, "");
              if (numbers.length <= 11) setCNHNumber(numbers);
            }}
            keyboardType="numeric"
            maxLength={11}
          />
        </View>

        <DocumentUpload
          label="Foto da CNH"
          documentType="cnh"
          value={cnhDocument}
          onUpload={handleCNHUpload}
          required
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número da Credencial <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: CRED-12345"
            placeholderTextColor={colors.text.tertiary}
            value={credentialNumber}
            onChangeText={setCredentialNumber}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Validade da Credencial <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {credentialExpiry.toLocaleDateString("pt-BR")}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={colors.text.primary} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={credentialExpiry}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={new Date()}
              onChange={(event, date) => {
                if (Platform.OS === "android") {
                  setShowDatePicker(false);
                }
                if (date) setCredentialExpiry(date);
              }}
            />
          )}
        </View>

        <DocumentUpload
          label="Foto da Credencial"
          documentType="credential"
          value={credentialDocument}
          onUpload={handleCredentialUpload}
          required
        />
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
  input: { backgroundColor: colors.background.tertiary, borderRadius: radius.md, padding: spacing.lg, fontSize: typography.fontSize.base, color: colors.text.primary, borderWidth: 1, borderColor: colors.border.secondary },
  dateButton: { backgroundColor: colors.background.tertiary, borderRadius: radius.md, padding: spacing.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: colors.border.secondary },
  dateText: { fontSize: typography.fontSize.base, color: colors.text.primary },
  buttons: { flexDirection: "row", gap: spacing.md, marginTop: spacing["2xl"] },
  backButton: { flex: 1, padding: spacing.xl, borderRadius: radius.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.background.tertiary, borderWidth: 1, borderColor: colors.border.secondary },
  backButtonText: { color: colors.text.primary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold },
  nextButton: { flex: 1, backgroundColor: colors.background.brandPrimary, padding: spacing.xl, borderRadius: radius.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm },
  nextButtonText: { color: colors.text.white, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold },
});

