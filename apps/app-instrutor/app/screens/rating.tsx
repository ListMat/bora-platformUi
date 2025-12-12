import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function RatingScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const createRatingMutation = trpc.rating.create.useMutation();
  const { data: hasRated } = trpc.rating.hasRated.useQuery({ lessonId: lessonId || "" });

  const handleSubmit = async () => {
    if (!lessonId) {
      Alert.alert("Erro", "ID da aula não encontrado");
      return;
    }

    if (rating === 0) {
      Alert.alert("Aviso", "Por favor, selecione uma nota de 1 a 5 estrelas");
      return;
    }

    try {
      await createRatingMutation.mutateAsync({
        lessonId,
        rating,
        comment: comment.trim() || undefined,
      });

      Alert.alert("Sucesso", "Avaliação enviada com sucesso!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao enviar avaliação");
    }
  };

  if (hasRated) {
    return (
      <View style={styles.container}>
        <View style={styles.alreadyRatedContainer}>
          <Text style={styles.alreadyRatedEmoji}>✓</Text>
          <Text style={styles.alreadyRatedTitle}>Avaliação já enviada</Text>
          <Text style={styles.alreadyRatedText}>
            Você já avaliou este aluno. Obrigado pelo seu feedback!
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Como foi a aula com este aluno?</Text>
      <Text style={styles.subtitle}>
        Sua avaliação ajuda a melhorar a experiência para todos
      </Text>

      {/* Rating Stars */}
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Text style={[styles.star, rating >= star && styles.starActive]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {rating > 0 && (
        <Text style={styles.ratingText}>
          {rating === 1 && "Muito ruim"}
          {rating === 2 && "Ruim"}
          {rating === 3 && "Regular"}
          {rating === 4 && "Bom"}
          {rating === 5 && "Excelente"}
        </Text>
      )}

      {/* Comment */}
      <View style={styles.commentContainer}>
        <Text style={styles.commentLabel}>Comentário (opcional)</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Como foi a experiência com este aluno?"
          multiline
          numberOfLines={4}
          value={comment}
          onChangeText={setComment}
          maxLength={500}
          textAlignVertical="top"
        />
        <Text style={styles.characterCount}>{comment.length}/500</Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={rating === 0 || createRatingMutation.isLoading}
      >
        <Text style={styles.submitButtonText}>
          {createRatingMutation.isLoading ? "Enviando..." : "Enviar Avaliação"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={() => router.back()}>
        <Text style={styles.skipButtonText}>Pular</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 48,
    color: "#ddd",
  },
  starActive: {
    color: "#FFD700",
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00C853",
    textAlign: "center",
    marginBottom: 32,
  },
  commentContainer: {
    marginBottom: 24,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  characterCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
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
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    padding: 16,
    alignItems: "center",
  },
  skipButtonText: {
    color: "#666",
    fontSize: 14,
  },
  alreadyRatedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  alreadyRatedEmoji: {
    fontSize: 64,
    color: "#00C853",
    marginBottom: 16,
  },
  alreadyRatedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  alreadyRatedText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#00C853",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
