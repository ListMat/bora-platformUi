import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface DocumentUploadProps {
  label: string;
  documentType: "cnh" | "credential";
  value?: string; // URL do documento já enviado
  onUpload: (base64: string, filename: string) => Promise<void>;
  onRemove?: () => void;
  error?: string;
  required?: boolean;
}

export function DocumentUpload({
  label,
  documentType,
  value,
  onUpload,
  onRemove,
  error,
  required = false,
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  const pickDocument = async () => {
    try {
      // Solicitar permissão
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de permissão para acessar suas fotos."
        );
        return;
      }

      // Abrir seletor de imagem
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setPreview(asset.uri);
        setUploading(true);

        try {
          // Converter para base64 se necessário
          const base64 = asset.base64
            ? `data:image/jpeg;base64,${asset.base64}`
            : asset.uri;

          const filename = `${documentType}-${Date.now()}.jpg`;
          await onUpload(base64, filename);
        } catch (error: any) {
          Alert.alert("Erro", error.message || "Erro ao fazer upload do documento");
          setPreview(null);
        } finally {
          setUploading(false);
        }
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao selecionar documento");
      setUploading(false);
    }
  };

  const handleRemove = () => {
    Alert.alert(
      "Remover documento",
      "Tem certeza que deseja remover este documento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            setPreview(null);
            onRemove?.();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      {preview ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: preview }} style={styles.preview} />
          <View style={styles.previewActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={pickDocument}
              disabled={uploading}
            >
              <Ionicons name="camera" size={20} color={colors.text.primary} />
              <Text style={styles.actionText}>Trocar</Text>
            </TouchableOpacity>
            {onRemove && (
              <TouchableOpacity
                style={[styles.actionButton, styles.removeButton]}
                onPress={handleRemove}
                disabled={uploading}
              >
                <Ionicons name="trash" size={20} color={colors.text.error} />
                <Text style={[styles.actionText, styles.removeText]}>
                  Remover
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.uploadButton, error && styles.uploadButtonError]}
          onPress={pickDocument}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color={colors.text.primary} />
          ) : (
            <>
              <Ionicons
                name="cloud-upload-outline"
                size={32}
                color={colors.text.primary}
              />
              <Text style={styles.uploadText}>
                Toque para selecionar {label.toLowerCase()}
              </Text>
              <Text style={styles.uploadHint}>
                JPG, PNG ou PDF (máx. 10MB)
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  labelContainer: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  required: {
    color: colors.text.error,
  },
  error: {
    fontSize: typography.fontSize.xs,
    color: colors.text.error,
    marginTop: spacing.xs,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: colors.border.secondary,
    borderStyle: "dashed",
    borderRadius: radius.md,
    padding: spacing["2xl"],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.tertiary,
    minHeight: 150,
  },
  uploadButtonError: {
    borderColor: colors.border.error,
  },
  uploadText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    marginTop: spacing.md,
    fontWeight: typography.fontWeight.medium,
  },
  uploadHint: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  previewContainer: {
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.background.tertiary,
  },
  preview: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    backgroundColor: colors.background.secondary,
  },
  previewActions: {
    flexDirection: "row",
    padding: spacing.md,
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background.secondary,
    gap: spacing.xs,
  },
  removeButton: {
    backgroundColor: colors.background.error + "20",
  },
  actionText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  removeText: {
    color: colors.text.error,
  },
});

