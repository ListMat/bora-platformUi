import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";

export default function AgendaScreen() {
  const [isAvailable, setIsAvailable] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.title}>🚗 BORA Instrutor</Text>
        <View style={styles.availabilityCard}>
          <Text style={styles.availabilityLabel}>Disponível para aulas</Text>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: "#ddd", true: "#FF6D00" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Próximas Aulas</Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Nenhuma aula agendada</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Definir Disponibilidade</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6D00",
    marginBottom: 16,
  },
  availabilityCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
  },
  availabilityLabel: {
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
  button: {
    backgroundColor: "#FF6D00",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

