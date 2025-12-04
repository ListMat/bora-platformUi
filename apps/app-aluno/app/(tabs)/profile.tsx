import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>Usuário BORA</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>usuario@bora.com</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Telefone</Text>
        <Text style={styles.value}>Não informado</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.logoutButton]}>
        <Text style={styles.logoutText}>Sair</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#00C853",
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
  logoutButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  logoutText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});

