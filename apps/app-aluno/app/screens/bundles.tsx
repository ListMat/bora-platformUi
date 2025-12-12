import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function BundlesScreen() {
  const router = useRouter();
  const { data: bundles, isLoading } = trpc.bundle.list.useQuery();
  const purchaseMutation = trpc.bundle.purchase.useMutation();

  const handlePurchase = async (bundleId: string) => {
    try {
      const purchase = await purchaseMutation.mutateAsync({
        bundleId,
        method: "CREDIT_CARD",
      });
      
      // Redirecionar para pagamento
      router.push(`/screens/bundlePayment?purchaseId=${purchase.id}`);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  const renderBundle = ({ item }: any) => (
    <View style={styles.bundleCard}>
      {item.featured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>POPULAR</Text>
        </View>
      )}
      <Text style={styles.bundleName}>{item.name}</Text>
      <Text style={styles.bundleDescription}>{item.description}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.lessonsCount}>{item.totalLessons} aulas</Text>
        <Text style={styles.price}>R$ {Number(item.price).toFixed(2)}</Text>
      </View>
      {item.discount > 0 && (
        <Text style={styles.discount}>🎉 {item.discount}% de desconto</Text>
      )}
      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => handlePurchase(item.id)}
        disabled={purchaseMutation.isLoading}
      >
        <Text style={styles.buyButtonText}>
          {purchaseMutation.isLoading ? "Processando..." : "Comprar Pacote"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pacotes de Aulas</Text>
      <Text style={styles.subtitle}>
        Economize comprando créditos de aula antecipadamente
      </Text>
      <FlatList
        data={bundles}
        keyExtractor={(item) => item.id}
        renderItem={renderBundle}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20 },
  list: { paddingBottom: 20 },
  bundleCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    position: "relative",
  },
  featuredBadge: {
    position: "absolute",
    top: -8,
    right: 16,
    backgroundColor: "#FF6D00",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  bundleName: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  bundleDescription: { fontSize: 14, color: "#666", marginBottom: 16 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  lessonsCount: { fontSize: 16, color: "#00C853", fontWeight: "600" },
  price: { fontSize: 24, fontWeight: "bold" },
  discount: { fontSize: 14, color: "#FF6D00", marginBottom: 16 },
  buyButton: {
    backgroundColor: "#00C853",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buyButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

