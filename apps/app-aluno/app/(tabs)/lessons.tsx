import { View, Text, StyleSheet } from "react-native";

export default function LessonsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Aulas</Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Você ainda não tem aulas agendadas</Text>
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

