import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { colors, spacing, radius, typography } from "@/theme";

const BRAZILIAN_STATES = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

interface StepLocationProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepLocation({ data, onUpdate, onNext, onBack }: StepLocationProps) {
  const [city, setCity] = useState(data.city || "");
  const [state, setState] = useState(data.state || "");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Precisamos de permissão para acessar sua localização");
        setLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      onUpdate({
        city,
        state,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      Alert.alert("Sucesso", "Localização obtida com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter sua localização");
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleNext = () => {
    if (!city.trim()) {
      Alert.alert("Erro", "Cidade é obrigatória");
      return;
    }
    if (!state || state.length !== 2) {
      Alert.alert("Erro", "Selecione um estado");
      return;
    }
    onUpdate({ city: city.trim(), state: state.toUpperCase() });
    onNext();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="location-outline" size={48} color={colors.background.brandPrimary} />
        <Text style={styles.title}>Localização</Text>
        <Text style={styles.subtitle}>Onde você atende?</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cidade <Text style={styles.required}>*</Text></Text>
          <TextInput style={styles.input} placeholder="São Paulo" placeholderTextColor={colors.text.tertiary} value={city} onChangeText={setCity} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Estado <Text style={styles.required}>*</Text></Text>
          <View style={styles.stateGrid}>
            {BRAZILIAN_STATES.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.stateButton, state === s && styles.stateButtonSelected]}
                onPress={() => setState(s)}
              >
                <Text style={[styles.stateText, state === s && styles.stateTextSelected]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation} disabled={loadingLocation}>
          {loadingLocation ? (
            <ActivityIndicator color={colors.text.white} />
          ) : (
            <>
              <Ionicons name="locate" size={20} color={colors.text.white} />
              <Text style={styles.locationButtonText}>Usar minha localização atual</Text>
            </>
          )}
        </TouchableOpacity>
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
  stateGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  stateButton: { padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.background.tertiary, borderWidth: 1, borderColor: colors.border.secondary, minWidth: 50, alignItems: "center" },
  stateButtonSelected: { backgroundColor: colors.background.brandPrimary, borderColor: colors.background.brandPrimary },
  stateText: { fontSize: typography.fontSize.base, color: colors.text.primary, fontWeight: typography.fontWeight.medium },
  stateTextSelected: { color: colors.text.white },
  locationButton: { backgroundColor: colors.background.success, padding: spacing.xl, borderRadius: radius.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, marginTop: spacing.md },
  locationButtonText: { color: colors.text.white, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold },
  buttons: { flexDirection: "row", gap: spacing.md, marginTop: spacing["2xl"] },
  backButton: { flex: 1, padding: spacing.xl, borderRadius: radius.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.background.tertiary, borderWidth: 1, borderColor: colors.border.secondary },
  backButtonText: { color: colors.text.primary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold },
  nextButton: { flex: 1, backgroundColor: colors.background.brandPrimary, padding: spacing.xl, borderRadius: radius.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm },
  nextButtonText: { color: colors.text.white, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold },
});

