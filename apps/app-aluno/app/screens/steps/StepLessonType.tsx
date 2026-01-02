import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface StepLessonTypeProps {
  formData: {
    lessonType: string;
  };
  updateFormData: (data: any) => void;
  instructorId: string;
  onNext: () => void;
}

const LESSON_TYPES = [
  {
    id: "1ª Habilitação",
    title: "1ª Habilitação",
    subtitle: "Primeiros comandos + ré",
    icon: "🎓",
    hasDualPedal: true,
  },
  {
    id: "Direção via pública",
    title: "Direção via pública",
    subtitle: "Avenidas e retornos",
    icon: "🛣️",
    hasDualPedal: false,
  },
  {
    id: "Baliza / Manobras",
    title: "Baliza / Manobras",
    subtitle: "Estacionamento e ré em L",
    icon: "🅿️",
    hasDualPedal: true,
  },
  {
    id: "Aula Noturna",
    title: "Aula Noturna",
    subtitle: "Treino noturno",
    icon: "🌙",
    hasDualPedal: false,
  },
  {
    id: "Simulado de Prova",
    title: "Simulado de Prova",
    subtitle: "Percurso oficial",
    icon: "📝",
    hasDualPedal: true,
  },
];

export default function StepLessonType({ formData, updateFormData, instructorId, onNext }: StepLessonTypeProps) {
  const handleSelect = (lessonType: string) => {
    updateFormData({ lessonType });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tipo de Aula</Text>
      <Text style={styles.subtitle}>Escolha o foco da sua aula</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsScroll}
      >
        {LESSON_TYPES.map((type) => {
          const isSelected = formData.lessonType === type.id;

          return (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
              ]}
              onPress={() => handleSelect(type.id)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{type.icon}</Text>
                {type.hasDualPedal && (
                  <View style={styles.badge}>
                    <Ionicons name="shield-checkmark" size={12} color={colors.text.white} />
                    <Text style={styles.badgeText}>Duplo-pedal</Text>
                  </View>
                )}
              </View>

              <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                {type.title}
              </Text>
              <Text style={[styles.cardSubtitle, isSelected && styles.cardSubtitleSelected]}>
                {type.subtitle}
              </Text>

              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Ionicons name="checkmark-circle" size={24} color={colors.background.brandPrimary} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Info Note */}
      <View style={styles.infoNote}>
        <Ionicons name="information-circle-outline" size={20} color={colors.text.tertiary} />
        <Text style={styles.infoText}>
          Carros com duplo-pedal garantem mais segurança durante a aula
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing["3xl"],
  },
  cardsScroll: {
    gap: spacing.lg,
    paddingRight: spacing.xl,
  },
  card: {
    width: 280,
    padding: spacing["2xl"],
    backgroundColor: colors.background.tertiary,
    borderRadius: radius["2xl"],
    borderWidth: 2,
    borderColor: colors.border.secondary,
    position: "relative",
  },
  cardSelected: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.background.brandPrimary,
    shadowColor: colors.background.brandPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },
  cardIcon: {
    fontSize: 48,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.brandPrimary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
    gap: spacing.xxs,
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.white,
    fontWeight: typography.fontWeight.semibold,
  },
  cardTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  cardTitleSelected: {
    color: colors.text.primary,
  },
  cardSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.sm,
  },
  cardSubtitleSelected: {
    color: colors.text.secondary,
  },
  selectedIndicator: {
    position: "absolute",
    top: spacing.lg,
    right: spacing.lg,
  },
  infoNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: spacing.lg,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    gap: spacing.md,
    marginTop: spacing["3xl"],
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
});
