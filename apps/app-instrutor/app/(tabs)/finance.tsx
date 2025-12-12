import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { trpc } from "@/lib/trpc";

export default function FinanceScreen() {
  const { data, isLoading, error } = trpc.payment.instructorRevenue.useQuery();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6D00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro ao carregar dados financeiros: {error.message}</Text>
      </View>
    );
  }

  const renderTransaction = ({ item }: any) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <Text style={styles.studentName}>{item.studentName}</Text>
        <Text style={styles.transactionAmount}>+ R$ {item.amount.toFixed(2)}</Text>
      </View>
      <Text style={styles.transactionDate}>
        Aula: {new Date(item.lessonDate).toLocaleDateString('pt-BR')}
      </Text>
      <Text style={styles.transactionDateSmall}>
        Pago em: {new Date(item.date).toLocaleDateString('pt-BR')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financeiro</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Receita Total</Text>
        <Text style={styles.cardValue}>R$ {data?.totalRevenue.toFixed(2) || "0,00"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Receita Pendente</Text>
        <Text style={[styles.cardValue, styles.pendingValue]}>
          R$ {data?.pendingRevenue.toFixed(2) || "0,00"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Disponível para Saque</Text>
        <Text style={[styles.cardValue, styles.availableValue]}>
          R$ {data?.availableForWithdrawal.toFixed(2) || "0,00"}
        </Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Solicitar Saque</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Transações Recentes</Text>
      {data?.recentPayments && data.recentPayments.length > 0 ? (
        <FlatList
          data={data.recentPayments}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          contentContainerStyle={styles.listContent}
        />
      ) : (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Nenhuma transação</Text>
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
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
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6D00",
  },
  pendingValue: {
    color: "#FFA500",
  },
  availableValue: {
    color: "#00C853",
  },
  button: {
    backgroundColor: "#FF6D00",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
  },
  errorText: {
    fontSize: 16,
    color: "#FF0000",
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  transactionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#00C853",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00C853",
  },
  transactionDate: {
    fontSize: 12,
    color: "#666",
  },
  transactionDateSmall: {
    fontSize: 11,
    color: "#999",
  },
});
