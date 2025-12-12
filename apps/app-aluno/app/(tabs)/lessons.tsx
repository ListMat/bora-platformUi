import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { trpc } from "@/lib/trpc";
import { useRouter } from "expo-router";

export default function LessonsScreen() {
  const router = useRouter();
  const { data, isLoading, error } = trpc.lesson.myLessons.useQuery({ limit: 20 });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro ao carregar aulas: {error.message}</Text>
      </View>
    );
  }

  const lessons = data?.lessons || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED": return "#FFA500";
      case "ACTIVE": return "#00C853";
      case "FINISHED": return "#666";
      case "CANCELLED": return "#FF0000";
      default: return "#999";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SCHEDULED": return "Agendada";
      case "ACTIVE": return "Em andamento";
      case "FINISHED": return "Finalizada";
      case "CANCELLED": return "Cancelada";
      default: return status;
    }
  };

  const renderLesson = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.lessonCard}
      onPress={() => {
        if (item.status === "ACTIVE" || item.status === "SCHEDULED") {
          router.push(`/screens/lessonLive?id=${item.id}`);
        }
      }}
    >
      <View style={styles.lessonHeader}>
        <Text style={styles.instructorName}>{item.instructor.user.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>
      <Text style={styles.lessonDate}>
        {new Date(item.scheduledAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
      <Text style={styles.lessonAddress}>{item.pickupAddress}</Text>
      <Text style={styles.lessonPrice}>R$ {Number(item.price).toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Aulas</Text>
      {lessons.length === 0 ? (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Você ainda não tem aulas agendadas</Text>
      </View>
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={(item) => item.id}
          renderItem={renderLesson}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  errorText: {
    fontSize: 16,
    color: "#FF0000",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  lessonCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#00C853",
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  instructorName: {
    fontSize: 18,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  lessonDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  lessonAddress: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  lessonPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00C853",
  },
});
