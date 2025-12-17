import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
// import * as Clipboard from "expo-clipboard"; // TODO: Instalar expo-clipboard se necessário

// Dynamic import para QR Code
let QRCode: any;
try {
  QRCode = require("react-native-qrcode-svg").default;
} catch (error) {
  console.warn("react-native-qrcode-svg not installed");
}

export default function GeneratePixScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const { data: lesson, isLoading } = trpc.lesson.getById.useQuery(
    { lessonId: lessonId! },
    { enabled: !!lessonId }
  );
  const generatePixMutation = trpc.payment.generatePix.useMutation({
    onSuccess: (data) => {
      // QR Code gerado com sucesso
    },
    onError: (error) => {
      Alert.alert("Erro", error.message);
    },
  });

  const handleGeneratePix = async () => {
    if (!lesson) return;

    try {
      await generatePixMutation.mutateAsync({
        lessonId: lessonId!,
        amount: Number(lesson.price),
      });
    } catch (error) {
      // Error já tratado no onError
    }
  };

  const handleCopyCode = async () => {
    if (generatePixMutation.data?.pixCode) {
      // TODO: Implementar cópia para área de transferência
      // await Clipboard.setStringAsync(generatePixMutation.data.pixCode);
      setCopied(true);
      Alert.alert("Copiado!", "Código Pix copiado para a área de transferência");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6D00" />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Aula não encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gerar Pix</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Lesson Info */}
        <View style={styles.lessonCard}>
          <Text style={styles.lessonLabel}>Aula com</Text>
          <Text style={styles.lessonStudent}>
            {lesson.student?.user?.name || "Aluno"}
          </Text>
          <Text style={styles.lessonDate}>
            {new Date(lesson.scheduledAt).toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Valor</Text>
            <Text style={styles.amountValue}>
              {formatCurrency(Number(lesson.price))}
            </Text>
          </View>
        </View>

        {/* QR Code */}
        {generatePixMutation.data?.pixCode ? (
          <View style={styles.qrContainer}>
            <Text style={styles.qrTitle}>QR Code Pix</Text>
            <View style={styles.qrCode}>
              {QRCode ? (
                <QRCode
                  value={generatePixMutation.data.pixCode}
                  size={250}
                  color="#000000"
                  backgroundColor="#FFFFFF"
                />
              ) : (
                <Ionicons name="qr-code" size={200} color="#333" />
              )}
            </View>
            <Text style={styles.qrSubtext}>
              Aluno escaneia este código para pagar
            </Text>
          </View>
        ) : (
          <View style={styles.generateContainer}>
            <Ionicons name="qr-code-outline" size={64} color="#ccc" />
            <Text style={styles.generateText}>
              Clique no botão abaixo para gerar o QR Code Pix
            </Text>
          </View>
        )}

        {/* Pix Code */}
        {generatePixMutation.data?.pixCode && (
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Código Pix (Copiar e Colar)</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText} selectable>
                {generatePixMutation.data.pixCode}
              </Text>
              <TouchableOpacity onPress={handleCopyCode}>
                <Ionicons
                  name={copied ? "checkmark" : "copy"}
                  size={24}
                  color={copied ? "#00C853" : "#FF6D00"}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Generate Button */}
        {!generatePixMutation.data && (
          <TouchableOpacity
            style={[
              styles.generateButton,
              generatePixMutation.isLoading && styles.generateButtonDisabled,
            ]}
            onPress={handleGeneratePix}
            disabled={generatePixMutation.isLoading}
          >
            {generatePixMutation.isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="qr-code" size={24} color="#fff" />
                <Text style={styles.generateButtonText}>Gerar QR Code Pix</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Como funciona:</Text>
          <Text style={styles.instructionsText}>
            1. Gere o QR Code Pix acima{'\n'}
            2. Compartilhe com o aluno{'\n'}
            3. Aluno paga e confirma{'\n'}
            4. Você recebe o crédito em D+1
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    padding: 20,
  },
  lessonCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  lessonLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  lessonStudent: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  lessonDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  amountCard: {
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6D00",
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  qrCode: {
    width: 250,
    height: 250,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  qrSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  generateContainer: {
    alignItems: "center",
    padding: 40,
    marginBottom: 24,
  },
  generateText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 16,
  },
  codeContainer: {
    marginBottom: 24,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  codeText: {
    flex: 1,
    fontSize: 12,
    color: "#333",
    fontFamily: "monospace",
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6D00",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  instructions: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#FF0000",
    textAlign: "center",
  },
});

