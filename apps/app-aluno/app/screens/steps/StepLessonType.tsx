import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface StepLessonTypeProps {
  formData: any;
  updateFormData: (updates: any) => void;
  instructorId: string;
  onNext: () => void;
}

const LESSON_TYPES = [
  {
    id: "1ª Habilitação",
    title: "1ª Habilitação",
    subtitle: "Primeiros comandos + ré",
    icon: "school",
    badge: "🎓",
  },
  {
    id: "Direção via pública",
    title: "Direção via pública",
    subtitle: "Avenidas e retornos",
    icon: "road",
    badge: "🛣️",
  },
  {
    id: "Baliza / Manobras",
    title: "Baliza / Manobras",
    subtitle: "Estacionamento e ré em L",
    icon: "car-sport",
    badge: "🅿️",
  },
  {
    id: "Aula Noturna",
    title: "Aula Noturna",
    subtitle: "Treino noturno",
    icon: "moon",
    badge: "🌙",
  },
  {
    id: "Simulado de Prova",
    title: "Simulado de Prova",
    subtitle: "Percurso oficial",
    icon: "document-text",
    badge: "📝",
  },
];

export default function StepLessonType({
  formData,
  updateFormData,
  instructorId,
  onNext,
}: StepLessonTypeProps) {
  const selectedType = formData.lessonType || "1ª Habilitação";

  const handleSelect = (type: string) => {
    updateFormData({ lessonType: type });
  };

  const renderType = ({ item }: { item: typeof LESSON_TYPES[0] }) => {
    const isSelected = selectedType === item.id;
    return (
      <TouchableOpacity
        style={[styles.typeCard, isSelected && styles.typeCardSelected]}
        onPress={() => handleSelect(item.id)}
      >
        <View style={styles.typeHeader}>
          <Text style={styles.typeBadge}>{item.badge}</Text>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color={colors.background.brandPrimary} />
          )}
        </View>
        <Text style={[styles.typeTitle, isSelected && styles.typeTitleSelected]}>
          {item.title}
        </Text>
        <Text style={[styles.typeSubtitle, isSelected && styles.typeSubtitleSelected]}>
          {item.subtitle}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tipo de aula</Text>
      <Text style={styles.subtitle}>Escolha o tipo de aula que você precisa</Text>

      <FlatList
        data={LESSON_TYPES}
        keyExtractor={(item) => item.id}
        renderItem={renderType}
        contentContainerStyle={styles.typesList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing["3xl"],
  },
  typesList: {
    paddingBottom: spacing["2xl"],
  },
  typeCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius["2xl"],
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: "transparent",
  },
  typeCardSelected: {
    backgroundColor: colors.background.tertiary,
    borderColor: colors.background.brandPrimary,
  },
  typeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  typeBadge: {
    fontSize: 32,
  },
  typeTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  typeTitleSelected: {
    color: colors.background.brandPrimary,
  },
  typeSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  typeSubtitleSelected: {
    color: colors.background.brandPrimary,
  },
});
