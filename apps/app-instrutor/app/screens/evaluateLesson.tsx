import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function EvaluateLessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const { data: skills, isLoading } = trpc.skill.list.useQuery();
  const evaluateMutation = trpc.skill.evaluateLesson.useMutation();

  const [evaluations, setEvaluations] = useState<
    Record<string, { rating: number; comment?: string }>
  >({});

  const handleRatingSelect = (skillId: string, rating: number) => {
    setEvaluations((prev) => ({
      ...prev,
      [skillId]: { ...prev[skillId], rating },
    }));
  };

  const handleCommentChange = (skillId: string, comment: string) => {
    setEvaluations((prev) => ({
      ...prev,
      [skillId]: { ...prev[skillId], comment },
    }));
  };

  const handleSubmit = async () => {
    const evalArray = Object.entries(evaluations).map(([skillId, data]) => ({
      skillId,
      rating: data.rating,
      comment: data.comment,
    }));

    if (evalArray.length === 0) {
      Alert.alert("Atenção", "Avalie pelo menos uma habilidade");
      return;
    }

    try {
      await evaluateMutation.mutateAsync({
        lessonId,
        evaluations: evalArray,
      });
      Alert.alert("Sucesso", "Avaliação enviada com sucesso!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  const renderStars = (skillId: string, currentRating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRatingSelect(skillId, star)}
            style={styles.starButton}
          >
            <Text style={[styles.star, star <= currentRating && styles.starFilled]}>
              {star <= currentRating ? "★" : "☆"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1:
        return "Precisa melhorar";
      case 2:
        return "Regular";
      case 3:
        return "Bom";
      case 4:
        return "Muito bom";
      case 5:
        return "Excelente";
      default:
        return "Selecione uma nota";
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Avaliar Habilidades do Aluno</Text>
      <Text style={styles.subtitle}>
        Avalie as habilidades trabalhadas nesta aula para ajudar o aluno a acompanhar seu progresso
      </Text>

      {skills?.map((skill) => (
        <View key={skill.id} style={styles.skillCard}>
          <View style={styles.skillHeader}>
            <Text style={styles.skillName}>{skill.name}</Text>
            <Text style={styles.skillCategory}>
              {skill.category === "BASIC"
                ? "Básico"
                : skill.category === "INTERMEDIATE"
                ? "Intermediário"
                : "Avançado"}
            </Text>
          </View>
          {skill.description && (
            <Text style={styles.skillDescription}>{skill.description}</Text>
          )}
          
          {renderStars(skill.id, evaluations[skill.id]?.rating || 0)}
          
          <Text
            style={[
              styles.ratingLabel,
              evaluations[skill.id]?.rating && styles.ratingLabelSelected,
            ]}
          >
            {getRatingLabel(evaluations[skill.id]?.rating || 0)}
          </Text>

          {evaluations[skill.id]?.rating > 0 && (
            <TextInput
              style={styles.commentInput}
              placeholder="Comentário opcional sobre esta habilidade..."
              value={evaluations[skill.id]?.comment || ""}
              onChangeText={(text) => handleCommentChange(skill.id, text)}
              multiline
              maxLength={500}
            />
          )}
        </View>
      ))}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            evaluateMutation.isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={evaluateMutation.isLoading}
        >
          <Text style={styles.submitButtonText}>
            {evaluateMutation.isLoading ? "Enviando..." : "Enviar Avaliação"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={evaluateMutation.isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 24, lineHeight: 22 },
  skillCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  skillName: { fontSize: 18, fontWeight: "bold", flex: 1 },
  skillCategory: {
    fontSize: 12,
    color: "#00C853",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  skillDescription: { fontSize: 14, color: "#666", marginBottom: 12 },
  starsContainer: { flexDirection: "row", marginBottom: 8 },
  starButton: { marginRight: 8 },
  star: { fontSize: 32, color: "#e0e0e0" },
  starFilled: { color: "#FF6D00" },
  ratingLabel: { fontSize: 14, color: "#999", marginBottom: 8 },
  ratingLabelSelected: { color: "#333", fontWeight: "600" },
  commentInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginTop: 8,
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: "#00C853",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cancelButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancelButtonText: { color: "#666", fontSize: 16, fontWeight: "600" },
});

