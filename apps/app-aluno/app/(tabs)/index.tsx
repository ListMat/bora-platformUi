import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>🚗 BORA Aluno</Text>
      <Text style={styles.subtitle}>Encontre instrutores próximos a você</Text>
      {/* TODO: Adicionar mapa com React Native Maps */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Mapa de Instrutores</Text>
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#00C853",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  mapText: {
    fontSize: 18,
    color: "#999",
  },
});

