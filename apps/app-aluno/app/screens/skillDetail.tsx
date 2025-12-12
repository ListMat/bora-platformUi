import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { trpc } from "@/lib/trpc";

export default function SkillDetailScreen() {
  const { skillId } = useLocalSearchParams<{ skillId: string }>();
  const { data: history, isLoading } = trpc.skill.skillHistory.useQuery({ skillId });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  const skill = history?.[0]?.skill;

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "#00C853";
    if (rating >= 3) return "#FF6D00";
    return "#E53935";
  };

  const renderEvaluation = ({ item }: any) => (
    <View style={styles.evaluationCard}>
      <View style={styles.evaluationHeader}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {new Date(item.createdAt).toLocaleDateString("pt-BR")}
          </Text>
          <Text style={styles.instructorText}>
            Instrutor: {item.instructor.user.name}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={[styles.ratingValue, { color: getRatingColor(item.rating) }]}>
            {item.rating}
          </Text>
          <Text style={styles.ratingLabel}>/ 5</Text>
        </View>
      </View>
      
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text key={star} style={styles.star}>
            {star <= item.rating ? "★" : "☆"}
          </Text>
        ))}
      </View>

      {item.comment && (
        <View style={styles.commentContainer}>
          <Text style={styles.commentLabel}>Comentário do Instrutor:</Text>
          <Text style={styles.commentText}>{item.comment}</Text>
        </View>
      )}

      <Text style={styles.lessonDate}>
        Aula: {new Date(item.lesson.scheduledAt).toLocaleString("pt-BR")}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {skill && (
        <View style={styles.header}>
          <Text style={styles.title}>{skill.name}</Text>
          {skill.description && (
            <Text style={styles.description}>{skill.description}</Text>
          )}
          <Text style={styles.category}>
            Categoria: {skill.category === "BASIC"
              ? "Básico"
              : skill.category === "INTERMEDIATE"
              ? "Intermediário"
              : "Avançado"}
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Histórico de Avaliações</Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderEvaluation}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhuma avaliação ainda para esta habilidade
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  description: { fontSize: 16, color: "#666", marginBottom: 8 },
  category: { fontSize: 14, color: "#00C853", fontWeight: "600", textTransform: "uppercase" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", padding: 20, paddingBottom: 12 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  evaluationCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  evaluationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  dateContainer: { flex: 1 },
  dateText: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  instructorText: { fontSize: 14, color: "#666" },
  ratingContainer: { flexDirection: "row", alignItems: "baseline" },
  ratingValue: { fontSize: 32, fontWeight: "bold" },
  ratingLabel: { fontSize: 16, color: "#999", marginLeft: 4 },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  star: { fontSize: 24, color: "#FF6D00", marginRight: 4 },
  commentContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentLabel: { fontSize: 12, color: "#666", marginBottom: 4, fontWeight: "600" },
  commentText: { fontSize: 14, color: "#333" },
  lessonDate: { fontSize: 12, color: "#999" },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
});

