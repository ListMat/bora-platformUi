import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useCallback } from "react";
import { useStripe } from "@stripe/stripe-react-native";

export default function PaymentSheetScreen() {
  const { paymentId, lessonId } = useLocalSearchParams<{ paymentId: string; lessonId: string }>();
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const createIntentMutation = trpc.payment.createIntent.useMutation();
  const confirmMutation = trpc.payment.confirm.useMutation();

  const handleInitializePayment = useCallback(async () => {
    try {
      if (!initPaymentSheet || !presentPaymentSheet) {
        Alert.alert("Erro", "Stripe não está configurado. Verifique a chave pública do Stripe.");
        return;
      }
      setLoading(true);
      const result = await createIntentMutation.mutateAsync({ paymentId });

      if (!result.clientSecret) {
        Alert.alert("Erro", "Não foi possível inicializar o pagamento");
        return;
      }

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: result.clientSecret,
        merchantDisplayName: "BORA - Aulas de Direção",
      });

      if (initError) {
        Alert.alert("Erro", initError.message);
        setLoading(false);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code !== "Canceled") {
          Alert.alert("Erro", presentError.message);
        }
        setLoading(false);
        return;
      }

      // Pagamento bem-sucedido
      await confirmMutation.mutateAsync({ paymentId });
      Alert.alert("Sucesso", "Pagamento realizado com sucesso!", [
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
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao processar pagamento");
    } finally {
      setLoading(false);
    }
  }, [paymentId, initPaymentSheet, presentPaymentSheet, createIntentMutation, confirmMutation, router, lessonId]);

  useEffect(() => {
    if (paymentId) {
      handleInitializePayment();
    }
  }, [paymentId, handleInitializePayment]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00C853" />
          <Text style={styles.loadingText}>Processando pagamento...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>Pagamento com Cartão</Text>
          <Text style={styles.subtitle}>
            O formulário de pagamento será exibido em breve
          </Text>
        </View>
      )}
    </View>
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
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});
