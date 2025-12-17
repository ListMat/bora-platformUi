import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Ionicons } from "@expo/vector-icons";

interface RescheduleModalProps {
  visible: boolean;
  onClose: () => void;
  lessonId: string;
  currentDate: Date;
  onReschedule: (newDate: Date) => void;
}

export default function RescheduleModal({
  visible,
  onClose,
  lessonId,
  currentDate,
  onReschedule,
}: RescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Gerar próximos 7 dias
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

  // Gerar slots de horário (30 em 30 minutos)
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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

    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Erro", "Selecione data e horário");
      return;
    }

    // Combinar data e hora
    const newDate = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    newDate.setHours(hours, minutes, 0, 0);

    // Verificar se é pelo menos 2 horas no futuro
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    if (newDate < twoHoursFromNow) {
      Alert.alert("Erro", "O novo horário deve ser pelo menos 2 horas no futuro");
      return;
    }

    onReschedule(newDate);
  };

  const renderDate = ({ item }: { item: Date }) => {
    const isSelected = selectedDate?.getTime() === item.getTime();
    return (
      <TouchableOpacity
        style={[styles.dateCard, isSelected && styles.dateCardSelected]}
        onPress={() => {
          setSelectedDate(item);
          setSelectedTime(""); // Reset time when date changes
        }}
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

  const renderTime = ({ item }: { item: string }) => {
    const isSelected = selectedTime === item;
    return (
      <TouchableOpacity
        style={[styles.timePill, isSelected && styles.timePillSelected]}
        onPress={() => setSelectedTime(item)}
      >
        <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reagendar Aula</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Current Date */}
        <View style={styles.currentDateCard}>
          <Text style={styles.currentDateLabel}>Data Atual</Text>
          <Text style={styles.currentDateValue}>
            {currentDate.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Nova Data</Text>
          <FlatList
            data={dates}
            keyExtractor={(item) => item.toISOString()}
            renderItem={renderDate}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesList}
          />

          {selectedDate && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Novo Horário</Text>
              <FlatList
                data={timeSlots}
                keyExtractor={(item) => item}
                renderItem={renderTime}
                numColumns={3}
                contentContainerStyle={styles.timesList}
              />
            </>
          )}

          {selectedDate && selectedTime && (
            <View style={styles.selectedInfo}>
              <Ionicons name="checkmark-circle" size={20} color="#FF6D00" />
              <Text style={styles.selectedText}>
                {formatDate(selectedDate)}, {selectedTime}
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              (!selectedDate || !selectedTime) && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!selectedDate || !selectedTime}
          >
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  currentDateCard: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    margin: 20,
    borderRadius: 12,
  },
  currentDateLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  currentDateValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  datesList: {
    paddingRight: 20,
  },
  dateCard: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  dateCardSelected: {
    backgroundColor: "#FF6D00",
    borderColor: "#FF6D00",
  },
  dateText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  dateTextSelected: {
    color: "#fff",
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  dateNumberSelected: {
    color: "#fff",
  },
  timesList: {
    paddingRight: 20,
  },
  timePill: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
    marginBottom: 8,
    minWidth: 80,
    alignItems: "center",
  },
  timePillSelected: {
    backgroundColor: "#FF6D00",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  timeTextSelected: {
    color: "#fff",
  },
  selectedInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 8,
    marginTop: 24,
    gap: 8,
  },
  selectedText: {
    fontSize: 14,
    color: "#FF6D00",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  confirmButton: {
    flex: 2,
    backgroundColor: "#FF6D00",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

