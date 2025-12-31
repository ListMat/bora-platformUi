import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface StepPhotoProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepPhoto({ data, onUpdate, onNext, onBack }: StepPhotoProps) {
  const [photo, setPhoto] = useState<string | null>(data.photo || null);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão necessária", "Precisamos de permissão para acessar suas fotos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const base64 = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        setPhoto(base64);
        onUpdate({ photo: base64 });
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao selecionar foto");
    }
  };

  const handleNext = () => {
    // Foto é opcional, pode pular
    onNext();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="camera-outline" size={48} color={colors.background.brandPrimary} />
        <Text style={styles.title}>Foto de Perfil</Text>
        <Text style={styles.subtitle}>Adicione uma foto (opcional)</Text>
      </View>

      <View style={styles.photoContainer}>
        {photo ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: photo }} style={styles.preview} />
            <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
              <Ionicons name="camera" size={20} color={colors.text.primary} />
              <Text style={styles.changeButtonText}>Trocar Foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Ionicons name="camera-outline" size={48} color={colors.text.primary} />
            <Text style={styles.uploadText}>Adicionar Foto</Text>
            <Text style={styles.uploadHint}>Toque para selecionar uma foto</Text>
          </TouchableOpacity>
        )}
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
  photoContainer: { alignItems: "center", marginBottom: spacing.xl },
  uploadButton: { width: 200, height: 200, borderRadius: radius.full, backgroundColor: colors.background.tertiary, borderWidth: 2, borderColor: colors.border.secondary, borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: spacing.md },
  uploadText: { fontSize: typography.fontSize.base, color: colors.text.primary, fontWeight: typography.fontWeight.medium },
  uploadHint: { fontSize: typography.fontSize.xs, color: colors.text.tertiary },
  previewContainer: { alignItems: "center", gap: spacing.md },
  preview: { width: 200, height: 200, borderRadius: radius.full },
  changeButton: { flexDirection: "row", alignItems: "center", gap: spacing.xs, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.background.secondary },
  changeButtonText: { fontSize: typography.fontSize.base, color: colors.text.primary, fontWeight: typography.fontWeight.medium },
  buttons: { flexDirection: "row", gap: spacing.md, marginTop: spacing["2xl"] },
  backButton: { flex: 1, padding: spacing.xl, borderRadius: radius.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.background.tertiary, borderWidth: 1, borderColor: colors.border.secondary },
  backButtonText: { color: colors.text.primary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold },
  nextButton: { flex: 1, backgroundColor: colors.background.brandPrimary, padding: spacing.xl, borderRadius: radius.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm },
  nextButtonText: { color: colors.text.white, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold },
});

