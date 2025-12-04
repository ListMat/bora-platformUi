import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function FinanceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financeiro</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Receita do Mês</Text>
        <Text style={styles.cardValue}>R$ 0,00</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Saldo Disponível</Text>
        <Text style={styles.cardValue}>R$ 0,00</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Solicitar Saque</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Transações Recentes</Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Nenhuma transação</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
});

