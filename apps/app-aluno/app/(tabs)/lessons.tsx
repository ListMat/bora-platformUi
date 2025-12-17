import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { trpc } from "@/lib/trpc";
import { useRouter } from "expo-router";
import { colors, spacing, radius, typography } from "@/theme";
import { Ionicons } from "@expo/vector-icons";

export default function LessonsScreen() {
  const router = useRouter();
  const { data, isLoading, error } = trpc.lesson.myLessons.useQuery({ limit: 20 });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.background.brandPrimary} />
        <Text style={styles.loadingText}>Carregando aulas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.text.error} />
        <Text style={styles.errorText}>Erro ao carregar aulas: {error.message}</Text>
      </View>
    );
  }

  const lessons = data?.lessons || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED": return colors.text.warning;
      case "ACTIVE": return colors.background.brandPrimary;
      case "FINISHED": return colors.text.secondary;
      case "CANCELLED": return colors.text.error;
      default: return colors.text.tertiary;
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
        <View style={styles.lessonInfo}>
          <Text style={styles.instructorName}>
            {item.instructor?.user?.name || "Instrutor"}
          </Text>
          <View style={styles.lessonMeta}>
            <Ionicons name="calendar-outline" size={14} color={colors.text.tertiary} />
            <Text style={styles.lessonDate}>
              {new Date(item.scheduledAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>
      {item.pickupAddress && (
        <View style={styles.lessonMeta}>
          <Ionicons name="location-outline" size={14} color={colors.text.tertiary} />
          <Text style={styles.lessonAddress}>{item.pickupAddress}</Text>
        </View>
      )}
      <View style={styles.lessonFooter}>
        <Text style={styles.lessonPrice}>R$ {Number(item.price || 0).toFixed(2)}</Text>
        {(item.status === "ACTIVE" || item.status === "SCHEDULED") && (
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Aulas</Text>
      {lessons.length === 0 ? (
        <View style={styles.placeholder}>
          <Ionicons name="calendar-outline" size={64} color={colors.text.tertiary} />
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
    backgroundColor: colors.background.primary,
    padding: spacing["2xl"],
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing["2xl"],
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    marginTop: spacing.lg,
    textAlign: "center",
  },
  loadingText: {
    marginTop: spacing.lg,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  errorText: {
    fontSize: typography.fontSize.base,
    color: colors.text.error,
    textAlign: "center",
    marginTop: spacing.md,
    paddingHorizontal: spacing["2xl"],
  },
  listContent: {
    paddingBottom: spacing["2xl"],
  },
  lessonCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius["2xl"],
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.background.brandPrimary,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  lessonInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  lessonMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  lessonDate: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  lessonAddress: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  statusText: {
    color: colors.text.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  lessonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.secondary,
  },
  lessonPrice: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.background.brandPrimary,
  },
});
