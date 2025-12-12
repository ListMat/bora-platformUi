import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";

export default function PixPaymentScreen() {
  const { paymentId, lessonId } = useLocalSearchParams<{ paymentId: string; lessonId: string }>();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const createPixMutation = trpc.payment.createPix.useMutation();
  const { data: pixData, isLoading: isLoadingPix } = createPixMutation;
  const { data: pixStatus, refetch: refetchStatus } = trpc.payment.checkPixStatus.useQuery(
    { paymentId: paymentId || "" },
    {
      enabled: !!paymentId && !!pixData,
      refetchInterval: 2000, // Polling a cada 2 segundos
    }
  );

  useEffect(() => {
    if (paymentId) {
      createPixMutation.mutate({ paymentId });
    }
  }, [paymentId]);

  useEffect(() => {
    if (pixStatus?.isPaid) {
      Alert.alert("Sucesso", "Pagamento PIX confirmado!", [
        {
          text: "OK",
          onPress: () => {
            if (lessonId) {
              router.push(`/screens/lessonLive?id=${lessonId}`);
            } else {
              router.back();
            }
          },
        },
      ]);
    }
  }, [pixStatus?.isPaid]);

  const handleCopyPix = async () => {
    if (pixData?.copyPaste) {
      await Clipboard.setStringAsync(pixData.copyPaste);
      setCopied(true);
      Alert.alert("Copiado", "Código PIX copiado para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoadingPix || !pixData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00C853" />
        <Text style={styles.loadingText}>Gerando código PIX...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Pagamento via PIX</Text>
      <Text style={styles.subtitle}>
        Escaneie o QR Code ou copie o código para pagar
      </Text>

      {/* QR Code */}
      <View style={styles.qrContainer}>
        {pixData.qrCode && (
          <QRCode
            value={pixData.qrCode}
            size={250}
            backgroundColor="#fff"
            color="#000"
          />
        )}
      </View>

      {/* Código PIX Copy & Paste */}
      <View style={styles.codeContainer}>
        <Text style={styles.codeLabel}>Código PIX:</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeText} selectable numberOfLines={3}>
            {pixData.copyPaste}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.copyButton, copied && styles.copyButtonActive]}
          onPress={handleCopyPix}
        >
          <Text style={styles.copyButtonText}>
            {copied ? "✓ Copiado!" : "Copiar Código"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status do pagamento */}
      {pixStatus && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text style={[
            styles.statusText,
            pixStatus.isPaid && styles.statusPaid
          ]}>
            {pixStatus.isPaid ? "✓ Pago" : "Aguardando pagamento..."}
          </Text>
        </View>
      )}

      <Text style={styles.helpText}>
        Após realizar o pagamento, aguarde a confirmação automática
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  qrContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  codeContainer: {
    width: "100%",
    marginBottom: 24,
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  codeBox: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  codeText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#333",
  },
  copyButton: {
    backgroundColor: "#00C853",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  copyButtonActive: {
    backgroundColor: "#00A043",
  },
  copyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  statusContainer: {
    width: "100%",
    padding: 16,
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFA500",
  },
  statusPaid: {
    color: "#00C853",
  },
  helpText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 16,
  },
});


