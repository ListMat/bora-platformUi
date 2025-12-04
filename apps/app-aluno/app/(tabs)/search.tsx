import { View, Text, StyleSheet, TextInput, FlatList } from "react-native";

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Instrutores</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Digite o nome ou localização..."
        placeholderTextColor="#999"
      />
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Nenhum instrutor encontrado</Text>
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
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
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

