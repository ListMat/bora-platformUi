import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";

// Completar autenticação do WebBrowser
WebBrowser.maybeCompleteAuthSession();

export default function BundlePaymentScreen() {
  const { purchaseId } = useLocalSearchParams<{ purchaseId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const createCheckoutMutation = trpc.bundle.createCheckoutSession.useMutation();
  const confirmMutation = trpc.bundle.confirmPurchase.useMutation();

  useEffect(() => {
    if (!purchaseId) return;

    const handlePayment = async () => {
      try {
        setLoading(true);
        
        // Criar checkout session
        const result = await createCheckoutMutation.mutateAsync({
          bundlePurchaseId: purchaseId,
          successUrl: `bora-aluno://payment/success?bundlePurchaseId=${purchaseId}`,
          cancelUrl: `bora-aluno://payment/cancel?bundlePurchaseId=${purchaseId}`,
        });

        if (!result.url) {
          Alert.alert("Erro", "Não foi possível inicializar o pagamento");
          setLoading(false);
          return;
        }

        // Abrir checkout no browser
        const browserResult = await WebBrowser.openBrowserAsync(result.url, {
          showInRecents: true,
        });

        // Se o usuário completou o pagamento
        if (browserResult.type === "success" || browserResult.type === "dismiss") {
          // Verificar se o pagamento foi confirmado
          await confirmMutation.mutateAsync({ bundlePurchaseId: purchaseId });
          
          Alert.alert("Sucesso", "Pacote comprado com sucesso!", [
            {
              text: "OK",
              onPress: () => {
                router.push("/screens/myBundles");
              },
            },
          ]);
        } else if (browserResult.type === "cancel") {
          Alert.alert("Cancelado", "Pagamento cancelado");
          router.back();
        }
      } catch (error: any) {
        Alert.alert("Erro", error.message || "Erro ao processar pagamento");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    handlePayment();
  }, [purchaseId, router]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00C853" />
          <Text style={styles.loadingText}>Abrindo checkout...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>Pagamento do Pacote</Text>
          <Text style={styles.subtitle}>
            Redirecionando para o checkout seguro...
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
