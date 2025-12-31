import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, spacing, radius, typography } from "@/theme";

interface StepWhenProps {
  data: {
    date: Date | null;
    time: string;
    lessonType: string;
  };
  onUpdate: (data: Partial<StepWhenProps["data"]>) => void;
  onNext: () => void;
}

const LESSON_TYPES = [
  { id: "1ª Habilitação", label: "1ª Habilitação", icon: "school" },
  { id: "Renovação", label: "Renovação", icon: "refresh" },
  { id: "Reciclagem", label: "Reciclagem", icon: "reload" },
  { id: "Mudança de Categoria", label: "Mudança de Categoria", icon: "swap-horizontal" },
];

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

export default function StepWhen({ data, onUpdate, onNext }: StepWhenProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      onUpdate({ date: selectedDate });
    }
  };

  const isValid = data.date && data.time && data.lessonType;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quando?</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
          <Text style={styles.dateButtonText}>
            {data.date
              ? data.date.toLocaleDateString("pt-BR", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                })
              : "Selecione a data"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={data.date || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      {/* Horário */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Que horas?</Text>
        <View style={styles.timeGrid}>
          {TIME_SLOTS.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeSlot,
                data.time === time && styles.timeSlotSelected,
              ]}
              onPress={() => onUpdate({ time })}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  data.time === time && styles.timeSlotTextSelected,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tipo de Aula */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipo de Aula</Text>
        <View style={styles.lessonTypeGrid}>
          {LESSON_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.lessonTypeCard,
                data.lessonType === type.id && styles.lessonTypeCardSelected,
              ]}
              onPress={() => onUpdate({ lessonType: type.id })}
            >
              <Ionicons
                name={type.icon as any}
                size={24}
                color={
                  data.lessonType === type.id
                    ? colors.background.brandPrimary
                    : colors.text.tertiary
                }
              />
              <Text
                style={[
                  styles.lessonTypeText,
                  data.lessonType === type.id && styles.lessonTypeTextSelected,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Botão Próximo */}
      <TouchableOpacity
        style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
        onPress={onNext}
        disabled={!isValid}
      >
        <Text style={styles.nextButtonText}>Próximo</Text>
        <Ionicons name="arrow-forward" size={20} color={colors.text.white} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
  },
  section: {
    marginBottom: spacing["3xl"],
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  dateButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  timeSlot: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  timeSlotSelected: {
    backgroundColor: colors.background.brandPrimary,
    borderColor: colors.background.brandPrimary,
  },
  timeSlotText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  timeSlotTextSelected: {
    color: colors.text.white,
  },
  lessonTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  lessonTypeCard: {
    width: "48%",
    padding: spacing.lg,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border.secondary,
    alignItems: "center",
    gap: spacing.sm,
  },
  lessonTypeCardSelected: {
    borderColor: colors.background.brandPrimary,
    backgroundColor: colors.background.secondary,
  },
  lessonTypeText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: "center",
    fontWeight: typography.fontWeight.medium,
  },
  lessonTypeTextSelected: {
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.background.brandPrimary,
    borderRadius: radius.lg,
    gap: spacing.sm,
    marginTop: spacing.xl,
    marginBottom: spacing["3xl"],
  },
  nextButtonDisabled: {
    backgroundColor: colors.background.disabled,
  },
  nextButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.white,
  },
});

