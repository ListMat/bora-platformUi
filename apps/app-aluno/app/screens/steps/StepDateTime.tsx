import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface StepDateTimeProps {
  formData: any;
  updateFormData: (updates: any) => void;
  instructorId: string;
  onNext: () => void;
}

export default function StepDateTime({
  formData,
  updateFormData,
  instructorId,
  onNext,
}: StepDateTimeProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(formData.date);
  const [selectedTime, setSelectedTime] = useState<string>(formData.time);

  const generateDates = () => {
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const dates = generateDates();

  const { data: slots, isLoading: isLoadingSlots } = trpc.instructor.slots.useQuery(
    {
      instructorId,
      date: selectedDate || new Date(),
    },
    {
      enabled: !!selectedDate && !!instructorId,
    }
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime("");
    updateFormData({ date, time: "" });
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    updateFormData({ time });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getTime() === today.getTime()) {
      return "Hoje";
    }
    if (date.getTime() === tomorrow.getTime()) {
      return "Amanhã";
    }

    return date.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" });
  };

  const renderDate = ({ item }: { item: Date }) => {
    const isSelected = selectedDate?.getTime() === item.getTime();
    return (
      <TouchableOpacity
        style={[styles.dateCard, isSelected && styles.dateCardSelected]}
        onPress={() => handleDateSelect(item)}
      >
        <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
          {formatDate(item)}
        </Text>
        <Text style={[styles.dateNumber, isSelected && styles.dateNumberSelected]}>
          {item.getDate()}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTime = ({ item }: { item: { time: string; available: boolean } }) => {
    const isSelected = selectedTime === item.time;
    return (
      <TouchableOpacity
        style={[
          styles.timePill,
          !item.available && styles.timePillDisabled,
          isSelected && styles.timePillSelected,
        ]}
        onPress={() => item.available && handleTimeSelect(item.time)}
        disabled={!item.available}
      >
        <Text
          style={[
            styles.timeText,
            !item.available && styles.timeTextDisabled,
            isSelected && styles.timeTextSelected,
          ]}
        >
          {item.time}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha a data e horário</Text>
      <Text style={styles.subtitle}>Selecione quando você quer fazer a aula</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <FlatList
          data={dates}
          keyExtractor={(item) => item.toISOString()}
          renderItem={renderDate}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.datesList}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Horário</Text>
        {!selectedDate ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Selecione uma data primeiro</Text>
          </View>
        ) : isLoadingSlots ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={colors.background.brandPrimary} />
            <Text style={styles.emptyText}>Carregando horários...</Text>
          </View>
        ) : !slots || slots.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Sem horário disponível nesse dia. Tente outro dia.
            </Text>
          </View>
        ) : (
          <FlatList
            data={slots}
            keyExtractor={(item) => item.time}
            renderItem={renderTime}
            numColumns={3}
            contentContainerStyle={styles.timesList}
            columnWrapperStyle={styles.timesRow}
          />
        )}
      </View>

      {selectedDate && selectedTime && (
        <View style={styles.selectedInfo}>
          <Ionicons name="checkmark-circle" size={20} color={colors.background.brandPrimary} />
          <Text style={styles.selectedText}>
            {formatDate(selectedDate)}, {selectedTime} – disponível
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
  section: {
    marginBottom: spacing["4xl"],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  datesList: {
    paddingRight: spacing["2xl"],
  },
  dateCard: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    backgroundColor: colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.lg,
    borderWidth: 2,
    borderColor: "transparent",
  },
  dateCardSelected: {
    backgroundColor: colors.background.brandPrimary,
    borderColor: colors.background.brandPrimary,
  },
  dateText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  dateTextSelected: {
    color: colors.text.white,
  },
  dateNumber: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  dateNumberSelected: {
    color: colors.text.white,
  },
  timesList: {
    paddingRight: spacing["2xl"],
  },
  timesRow: {
    justifyContent: "flex-start",
    marginBottom: spacing.sm,
  },
  timePill: {
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.background.secondary,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    minWidth: 80,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  timePillDisabled: {
    opacity: 0.4,
  },
  timePillSelected: {
    backgroundColor: colors.background.brandPrimary,
    borderColor: colors.background.brandPrimary,
  },
  timeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  timeTextDisabled: {
    color: colors.text.tertiary,
  },
  timeTextSelected: {
    color: colors.text.white,
  },
  emptyState: {
    padding: spacing["5xl"],
    alignItems: "center",
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    textAlign: "center",
    marginTop: spacing.lg,
  },
  selectedInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.background.brandPrimary,
  },
  selectedText: {
    fontSize: typography.fontSize.sm,
    color: colors.background.brandPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
});
