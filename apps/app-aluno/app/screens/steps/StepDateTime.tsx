import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, spacing, radius, typography } from "@/theme";
import { trpc } from "@/lib/trpc";

interface StepDateTimeProps {
  formData: {
    date: Date | null;
    time: string;
  };
  updateFormData: (data: any) => void;
  instructorId: string;
  onNext: () => void;
}

export default function StepDateTime({ formData, updateFormData, instructorId, onNext }: StepDateTimeProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch available slots from instructor
  const { data: slotsData, isLoading } = trpc.instructor.slots.useQuery(
    {
      instructorId,
      date: formData.date || new Date()
    },
    { enabled: !!instructorId }
  );

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      updateFormData({ date: selectedDate, time: "" });
    }
  };

  const handleTimeSelect = (time: string) => {
    updateFormData({ time });
  };

  // Generate next 7 days for horizontal calendar
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const nextDays = getNextDays();
  const isValid = formData.date && formData.time;

  // Generate 30-min interval time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const availableSlots = slotsData?.availableSlots || timeSlots;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data & Horário</Text>
      <Text style={styles.subtitle}>Escolha quando você quer sua aula</Text>

      {/* Horizontal Calendar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dia</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarScroll}
        >
          {nextDays.map((day, index) => {
            const isSelected = formData.date?.toDateString() === day.toDateString();
            const dayName = day.toLocaleDateString("pt-BR", { weekday: "short" });
            const dayNumber = day.getDate();
            const hasAvailability = true; // TODO: Check actual availability

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCard,
                  isSelected && styles.dayCardSelected,
                  !hasAvailability && styles.dayCardDisabled,
                ]}
                onPress={() => updateFormData({ date: day, time: "" })}
                disabled={!hasAvailability}
              >
                <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                  {dayName}
                </Text>
                <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
                  {dayNumber}
                </Text>
                {hasAvailability && (
                  <View style={[styles.availabilityDot, isSelected && styles.availabilityDotSelected]} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Time Slots */}
      {formData.date && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horário</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.background.brandPrimary} />
          ) : availableSlots.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeSlotsScroll}
            >
              {availableSlots.map((slot) => {
                const isSelected = formData.time === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.timeSlot,
                      isSelected && styles.timeSlotSelected,
                    ]}
                    onPress={() => handleTimeSelect(slot)}
                  >
                    <Text style={[styles.timeSlotText, isSelected && styles.timeSlotTextSelected]}>
                      {slot}
                    </Text>
                    <Text style={[styles.timeSlotLabel, isSelected && styles.timeSlotLabelSelected]}>
                      disponível
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={colors.text.tertiary} />
              <Text style={styles.emptyStateText}>Sem horário nesse dia.</Text>
              <Text style={styles.emptyStateSubtext}>Tenta outro dia?</Text>
            </View>
          )}
        </View>
      )}

      {/* Validation Note */}
      {formData.date && formData.time && (
        <View style={styles.validationNote}>
          <Ionicons name="checkmark-circle" size={20} color={colors.text.success} />
          <Text style={styles.validationText}>
            {formData.date.toLocaleDateString("pt-BR", { weekday: "long" })}, {formData.time} – disponível
          </Text>
        </View>
      )}
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
  section: {
    marginBottom: spacing["3xl"],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  calendarScroll: {
    gap: spacing.md,
    paddingRight: spacing.xl,
  },
  dayCard: {
    width: 70,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.border.secondary,
    alignItems: "center",
    gap: spacing.xs,
  },
  dayCardSelected: {
    backgroundColor: colors.background.brandPrimary,
    borderColor: colors.background.brandPrimary,
  },
  dayCardDisabled: {
    opacity: 0.4,
  },
  dayName: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    textTransform: "capitalize",
    fontWeight: typography.fontWeight.medium,
  },
  dayNameSelected: {
    color: colors.text.white,
  },
  dayNumber: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  dayNumberSelected: {
    color: colors.text.white,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.background.brandPrimary,
  },
  availabilityDotSelected: {
    backgroundColor: colors.text.white,
  },
  timeSlotsScroll: {
    gap: spacing.md,
    paddingRight: spacing.xl,
  },
  timeSlot: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border.secondary,
    alignItems: "center",
    minWidth: 100,
  },
  timeSlotSelected: {
    backgroundColor: colors.background.brandPrimary,
    borderColor: colors.background.brandPrimary,
  },
  timeSlotText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  timeSlotTextSelected: {
    color: colors.text.white,
  },
  timeSlotLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  timeSlotLabelSelected: {
    color: colors.text.white,
    opacity: 0.9,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing["4xl"],
  },
  emptyStateText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginTop: spacing.lg,
  },
  emptyStateSubtext: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  validationNote: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.background.success + "20",
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  validationText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.success,
    fontWeight: typography.fontWeight.medium,
    textTransform: "capitalize",
  },
});
