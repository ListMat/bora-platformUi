import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { trpc } from "@/lib/trpc";

export default function MyBundlesScreen() {
  const { data: purchases, isLoading } = trpc.bundle.myPurchases.useQuery();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  const renderPurchase = ({ item }: any) => {
    const expiryDate = item.expiresAt ? new Date(item.expiresAt) : null;
    const isExpiringSoon = expiryDate && (expiryDate.getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000;

    return (
      <View style={styles.purchaseCard}>
        <View style={styles.header}>
          <Text style={styles.bundleName}>{item.bundle.name}</Text>
          <View style={styles.creditsContainer}>
            <Text style={styles.creditsLabel}>Créditos</Text>
            <Text style={styles.creditsValue}>
              {item.remainingCredits}/{item.totalCredits}
            </Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${(item.remainingCredits / item.totalCredits) * 100}%`,
              },
            ]}
          />
        </View>

        {expiryDate && (
          <Text style={[styles.expiryText, isExpiringSoon && styles.expiryWarning]}>
            {isExpiringSoon ? "⚠️ " : ""}
            Expira em: {expiryDate.toLocaleDateString("pt-BR")}
          </Text>
        )}

        <Text style={styles.purchaseDate}>
          Comprado em: {new Date(item.createdAt).toLocaleDateString("pt-BR")}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Pacotes</Text>
      {purchases && purchases.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Você ainda não possui pacotes de aulas
          </Text>
          <Text style={styles.emptySubtext}>
            Compre pacotes para economizar nas suas aulas!
          </Text>
        </View>
      ) : (
        <FlatList
          data={purchases}
          keyExtractor={(item) => item.id}
          renderItem={renderPurchase}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  list: { paddingBottom: 20 },
  purchaseCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bundleName: { fontSize: 18, fontWeight: "bold", flex: 1 },
  creditsContainer: { alignItems: "flex-end" },
  creditsLabel: { fontSize: 12, color: "#666" },
  creditsValue: { fontSize: 24, fontWeight: "bold", color: "#00C853" },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBarFill: { height: "100%", backgroundColor: "#00C853" },
  expiryText: { fontSize: 14, color: "#666", marginBottom: 4 },
  expiryWarning: { color: "#FF6D00", fontWeight: "600" },
  purchaseDate: { fontSize: 12, color: "#999" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
});

