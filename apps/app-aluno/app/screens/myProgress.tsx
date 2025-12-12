import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { trpc } from "@/lib/trpc";
import { useRouter } from "expo-router";

export default function MyProgressScreen() {
  const router = useRouter();
  const { data: progress, isLoading } = trpc.skill.myProgress.useQuery();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  const getProgressColor = (rating: number) => {
    if (rating >= 4) return "#00C853"; // Verde
    if (rating >= 3) return "#FF6D00"; // Laranja
    return "#E53935"; // Vermelho
  };

  const getProgressLabel = (rating: number) => {
    if (rating >= 4) return "Excelente";
    if (rating >= 3) return "Bom";
    if (rating >= 2) return "Regular";
    return "Precisa melhorar";
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Progresso</Text>
        <View style={styles.overallProgressCard}>
          <Text style={styles.overallProgressLabel}>Preparação Geral</Text>
          <Text style={styles.overallProgressValue}>
            {progress?.overallProgress}%
          </Text>
          <View style={styles.progressCircle}>
            <View
              style={[
                styles.progressCircleFill,
                {
                  width: `${progress?.overallProgress}%`,
                  backgroundColor:
                    progress && progress.overallProgress >= 70
                      ? "#00C853"
                      : progress && progress.overallProgress >= 50
                      ? "#FF6D00"
                      : "#E53935",
                },
              ]}
            />
          </View>
          {progress?.readyForExam ? (
            <Text style={styles.readyBadge}>✓ Pronto para o exame!</Text>
          ) : (
            <Text style={styles.notReadyBadge}>
              Continue praticando para alcançar 70%
            </Text>
          )}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Habilidades Avaliadas</Text>

      {progress?.skills.map((item: any) => (
        <TouchableOpacity
          key={item.skill.id}
          style={styles.skillCard}
          onPress={() =>
            router.push(`/screens/skillDetail?skillId=${item.skill.id}`)
          }
        >
          <View style={styles.skillHeader}>
            <View style={styles.skillInfo}>
              <Text style={styles.skillName}>{item.skill.name}</Text>
              <Text style={styles.skillCategory}>
                {item.skill.category === "BASIC"
                  ? "Básico"
                  : item.skill.category === "INTERMEDIATE"
                  ? "Intermediário"
                  : "Avançado"}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text
                style={[
                  styles.skillRating,
                  { color: getProgressColor(item.avgRating) },
                ]}
              >
                {item.avgRating.toFixed(1)} ★
              </Text>
              <Text
                style={[
                  styles.skillLabel,
                  { color: getProgressColor(item.avgRating) },
                ]}
              >
                {getProgressLabel(item.avgRating)}
              </Text>
            </View>
          </View>
          {item.skill.description && (
            <Text style={styles.skillDescription}>
              {item.skill.description}
            </Text>
          )}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${(item.avgRating / 5) * 100}%`,
                  backgroundColor: getProgressColor(item.avgRating),
                },
              ]}
            />
          </View>
          <Text style={styles.skillStats}>
            {item.totalEvaluations} avaliações • Última nota: {item.lastRating}
          </Text>
        </TouchableOpacity>
      ))}

      {progress?.skills.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Você ainda não tem habilidades avaliadas
          </Text>
          <Text style={styles.emptySubtext}>
            Complete suas aulas para receber avaliações do instrutor
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { padding: 20, backgroundColor: "#00C853" },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 16 },
  overallProgressCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  overallProgressLabel: { fontSize: 16, color: "#666", marginBottom: 8 },
  overallProgressValue: { fontSize: 48, fontWeight: "bold", color: "#00C853" },
  progressCircle: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginVertical: 12,
  },
  progressCircleFill: { height: "100%" },
  readyBadge: {
    marginTop: 8,
    fontSize: 16,
    color: "#00C853",
    fontWeight: "600",
  },
  notReadyBadge: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
    paddingBottom: 12,
  },
  skillCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  skillInfo: { flex: 1 },
  skillName: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  skillCategory: { fontSize: 12, color: "#666", textTransform: "uppercase" },
  ratingContainer: { alignItems: "flex-end" },
  skillRating: { fontSize: 20, fontWeight: "bold" },
  skillLabel: { fontSize: 12, fontWeight: "600" },
  skillDescription: { fontSize: 14, color: "#666", marginBottom: 12 },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: { height: "100%" },
  skillStats: { fontSize: 12, color: "#999" },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
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

