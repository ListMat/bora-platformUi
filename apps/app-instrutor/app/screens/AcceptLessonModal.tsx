import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface AcceptLessonModalProps {
  visible: boolean;
  onClose: () => void;
  vehicle?: any;
}

type TimeMode = "periods" | "custom";

const TIME_PERIODS = [
  { label: "Manhã", start: "08:00", end: "12:00" },
  { label: "Tarde", start: "13:00", end: "18:00" },
  { label: "Noite", start: "18:00", end: "22:00" },
];

const DEFAULT_LESSON_TYPES = [
  "1ª Habilitação",
  "Direção via pública",
  "Baliza / Manobras",
  "Aula Noturna",
  "Simulado de Prova",
];

export default function AcceptLessonModal({
  visible,
  onClose,
  vehicle,
}: AcceptLessonModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Step 0: Dias e Horários
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [timeMode, setTimeMode] = useState<TimeMode>("periods");
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [customTimes, setCustomTimes] = useState<{ start: string; end: string }[]>([]);
  const [newCustomTime, setNewCustomTime] = useState({ start: "", end: "" });
  
  // Step 1: Tipos de Aula
  const [selectedLessonTypes, setSelectedLessonTypes] = useState<string[]>([]);
  const [customLessonTypes, setCustomLessonTypes] = useState<string[]>([]);
  const [newLessonType, setNewLessonType] = useState("");
  const [showAddLessonType, setShowAddLessonType] = useState(false);
  
  // Step 2: Veículo
  const [selectedVehicle, setSelectedVehicle] = useState<any>(vehicle);

  const { data: vehicles } = trpc.vehicle.myVehicles.useQuery();
  
  const acceptMutation = trpc.instructor.acceptLessons.useMutation({
    onSuccess: () => {
      Alert.alert("Sucesso", "Agora você está recebendo solicitações de aulas!");
      onClose();
      resetForm();
    },
    onError: (error) => {
      Alert.alert("Erro", error.message);
    },
  });

  const resetForm = () => {
    setCurrentStep(0);
    setSelectedDates([]);
    setTimeMode("periods");
    setSelectedPeriods([]);
    setCustomTimes([]);
    setNewCustomTime({ start: "", end: "" });
    setSelectedLessonTypes([]);
    setCustomLessonTypes([]);
    setNewLessonType("");
    setShowAddLessonType(false);
  };

  // Gerar próximos 14 dias
  const generateDates = () => {
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const dates = generateDates();

  const toggleDate = (date: Date) => {
    const dateStr = date.toISOString();
    setSelectedDates((prev) => {
      const exists = prev.some((d) => d.toISOString() === dateStr);
      if (exists) {
        return prev.filter((d) => d.toISOString() !== dateStr);
      } else {
        return [...prev, date];
      }
    });
  };

  const togglePeriod = (period: string) => {
    setSelectedPeriods((prev) => {
      if (prev.includes(period)) {
        return prev.filter((p) => p !== period);
      } else {
        return [...prev, period];
      }
    });
  };

  const addCustomTime = () => {
    if (!newCustomTime.start || !newCustomTime.end) {
      Alert.alert("Erro", "Preencha início e fim do horário");
      return;
    }

    // Validar formato HH:MM
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(newCustomTime.start) || !timeRegex.test(newCustomTime.end)) {
      Alert.alert("Erro", "Use o formato HH:MM (ex: 08:00, 14:30)");
      return;
    }

    // Validar que fim > início
    const [startHour, startMin] = newCustomTime.start.split(":").map(Number);
    const [endHour, endMin] = newCustomTime.end.split(":").map(Number);
    const startTotal = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;

    if (endTotal <= startTotal) {
      Alert.alert("Erro", "O horário de fim deve ser maior que o de início");
      return;
    }

    setCustomTimes((prev) => [...prev, { ...newCustomTime }]);
    setNewCustomTime({ start: "", end: "" });
  };

  const removeCustomTime = (index: number) => {
    setCustomTimes((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleLessonType = (type: string) => {
    setSelectedLessonTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const addCustomLessonType = () => {
    if (!newLessonType.trim()) {
      Alert.alert("Erro", "Digite um nome para o tipo de aula");
      return;
    }

    if (DEFAULT_LESSON_TYPES.includes(newLessonType) || customLessonTypes.includes(newLessonType)) {
      Alert.alert("Erro", "Este tipo de aula já existe");
      return;
    }

    setCustomLessonTypes((prev) => [...prev, newLessonType.trim()]);
    setSelectedLessonTypes((prev) => [...prev, newLessonType.trim()]);
    setNewLessonType("");
    setShowAddLessonType(false);
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Validar Step 0: Dias e Horários
      if (selectedDates.length === 0) {
        Alert.alert("Erro", "Selecione pelo menos um dia");
        return;
      }

      if (timeMode === "periods" && selectedPeriods.length === 0) {
        Alert.alert("Erro", "Selecione pelo menos um período");
        return;
      }

      if (timeMode === "custom" && customTimes.length === 0) {
        Alert.alert("Erro", "Adicione pelo menos um horário customizado");
        return;
      }
    } else if (currentStep === 1) {
      // Validar Step 1: Tipos de Aula
      if (selectedLessonTypes.length === 0) {
        Alert.alert("Erro", "Selecione pelo menos um tipo de aula");
        return;
      }
    } else if (currentStep === 2) {
      // Validar Step 2: Veículo
      if (!selectedVehicle) {
        Alert.alert("Erro", "Selecione um veículo");
        return;
      }
      handleAccept();
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handleAccept = () => {
    // Preparar dados para enviar
    const availabilityData = {
      dates: selectedDates.map((d) => d.toISOString()),
      timeSlots: timeMode === "periods"
        ? selectedPeriods.map((period) => {
            const periodData = TIME_PERIODS.find((p) => p.label === period);
            return { start: periodData!.start, end: periodData!.end };
          })
        : customTimes,
      lessonTypes: selectedLessonTypes,
      vehicleId: selectedVehicle.id,
    };

    acceptMutation.mutate(availabilityData as any);
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

    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const renderDate = ({ item }: { item: Date }) => {
    const isSelected = selectedDates.some((d) => d.toISOString() === item.toISOString());
    return (
      <TouchableOpacity
        style={[styles.dateCard, isSelected && styles.dateCardSelected]}
        onPress={() => toggleDate(item)}
      >
        <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
          {formatDate(item)}
        </Text>
        <Text style={[styles.dateNumber, isSelected && styles.dateNumberSelected]}>
          {item.getDate()}
        </Text>
        {isSelected && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark" size={16} color={colors.text.white} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderPeriod = (period: { label: string; start: string; end: string }) => {
    const isSelected = selectedPeriods.includes(period.label);
    return (
      <TouchableOpacity
        key={period.label}
        style={[styles.periodCard, isSelected && styles.periodCardSelected]}
        onPress={() => togglePeriod(period.label)}
      >
        <Text style={[styles.periodText, isSelected && styles.periodTextSelected]}>
          {period.label}
        </Text>
        <Text style={[styles.periodTime, isSelected && styles.periodTimeSelected]}>
          {period.start} - {period.end}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCustomTime = (time: { start: string; end: string }, index: number) => {
    return (
      <View key={index} style={styles.customTimeRow}>
        <View style={styles.customTimeCard}>
          <Text style={styles.customTimeText}>
            {time.start} - {time.end}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.removeTimeButton}
          onPress={() => removeCustomTime(index)}
        >
          <Ionicons name="close-circle" size={24} color={colors.text.error} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderLessonType = (type: string) => {
    const isSelected = selectedLessonTypes.includes(type);
    return (
      <TouchableOpacity
        key={type}
        style={[styles.typeChip, isSelected && styles.typeChipSelected]}
        onPress={() => toggleLessonType(type)}
      >
        <Text style={[styles.typeText, isSelected && styles.typeTextSelected]}>
          {type}
        </Text>
        {isSelected && (
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={colors.background.brandPrimary}
            style={{ marginLeft: spacing.xs }}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderVehicle = ({ item }: { item: any }) => {
    const isSelected = selectedVehicle?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.vehicleCard, isSelected && styles.vehicleCardSelected]}
        onPress={() => setSelectedVehicle(item)}
      >
        <Text style={[styles.vehicleText, isSelected && styles.vehicleTextSelected]}>
          {item.brand} {item.model} · {item.transmission === "AUTOMATICO" ? "Automático" : "Manual"}
        </Text>
        {item.acceptStudentCar && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Aceita carro do aluno</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Aceitar Aulas</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Stepper */}
        <View style={styles.stepper}>
          {[0, 1, 2].map((step) => (
            <View key={step} style={styles.stepContainer}>
              <View
                style={[
                  styles.stepCircle,
                  step === currentStep && styles.stepCircleActive,
                  step < currentStep && styles.stepCircleCompleted,
                ]}
              >
                {step < currentStep ? (
                  <Ionicons name="checkmark" size={16} color={colors.text.white} />
                ) : (
                  <Text style={styles.stepNumber}>{step + 1}</Text>
                )}
              </View>
              {step < 2 && (
                <View
                  style={[
                    styles.stepLine,
                    step < currentStep && styles.stepLineCompleted,
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        {/* Content */}
        <ScrollView style={styles.content}>
          {currentStep === 0 && (
            <View>
              <Text style={styles.stepTitle}>Disponibilidade</Text>
              <Text style={styles.stepSubtitle}>
                Selecione os dias e horários disponíveis
              </Text>

              {/* Seleção de Dias */}
              <Text style={styles.sectionLabel}>Dias (selecione múltiplos)</Text>
              <FlatList
                data={dates}
                keyExtractor={(item) => item.toISOString()}
                renderItem={renderDate}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.datesList}
              />
              {selectedDates.length > 0 && (
                <Text style={styles.selectedCount}>
                  {selectedDates.length} dia{selectedDates.length > 1 ? "s" : ""} selecionado{selectedDates.length > 1 ? "s" : ""}
                </Text>
              )}

              {/* Seleção de Horários */}
              <Text style={[styles.sectionLabel, { marginTop: spacing['3xl'] }]}>
                Horários
              </Text>

              {/* Toggle entre Períodos e Customizado */}
              <View style={styles.timeModeToggle}>
                <TouchableOpacity
                  style={[
                    styles.timeModeButton,
                    timeMode === "periods" && styles.timeModeButtonActive,
                  ]}
                  onPress={() => setTimeMode("periods")}
                >
                  <Text
                    style={[
                      styles.timeModeText,
                      timeMode === "periods" && styles.timeModeTextActive,
                    ]}
                  >
                    Períodos
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.timeModeButton,
                    timeMode === "custom" && styles.timeModeButtonActive,
                  ]}
                  onPress={() => setTimeMode("custom")}
                >
                  <Text
                    style={[
                      styles.timeModeText,
                      timeMode === "custom" && styles.timeModeTextActive,
                    ]}
                  >
                    Personalizado
                  </Text>
                </TouchableOpacity>
              </View>

              {timeMode === "periods" ? (
                <View style={styles.periodsContainer}>
                  {TIME_PERIODS.map(renderPeriod)}
                </View>
              ) : (
                <View>
                  {/* Lista de horários customizados */}
                  {customTimes.length > 0 && (
                    <View style={styles.customTimesList}>
                      {customTimes.map((time, index) => renderCustomTime(time, index))}
                    </View>
                  )}

                  {/* Formulário para adicionar horário */}
                  <View style={styles.addCustomTimeContainer}>
                    <View style={styles.timeInputRow}>
                      <View style={styles.timeInput}>
                        <Text style={styles.timeInputLabel}>Início</Text>
                        <TextInput
                          style={styles.timeInputField}
                          placeholder="08:00"
                          placeholderTextColor={colors.text.placeholder}
                          value={newCustomTime.start}
                          onChangeText={(text) =>
                            setNewCustomTime((prev) => ({ ...prev, start: text }))
                          }
                          maxLength={5}
                        />
                      </View>
                      <View style={styles.timeInput}>
                        <Text style={styles.timeInputLabel}>Fim</Text>
                        <TextInput
                          style={styles.timeInputField}
                          placeholder="12:00"
                          placeholderTextColor={colors.text.placeholder}
                          value={newCustomTime.end}
                          onChangeText={(text) =>
                            setNewCustomTime((prev) => ({ ...prev, end: text }))
                          }
                          maxLength={5}
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.addTimeButton}
                        onPress={addCustomTime}
                      >
                        <Ionicons name="add" size={24} color={colors.text.white} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.timeInputHint}>
                      Formato: HH:MM (ex: 08:00, 14:30)
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {currentStep === 1 && (
            <View>
              <Text style={styles.stepTitle}>Tipos de Aula</Text>
              <Text style={styles.stepSubtitle}>
                Selecione múltiplos tipos que você oferece
              </Text>

              {/* Tipos padrão */}
              <Text style={styles.sectionLabel}>Tipos Disponíveis</Text>
              <View style={styles.typesContainer}>
                {DEFAULT_LESSON_TYPES.map(renderLessonType)}
                {customLessonTypes.map(renderLessonType)}
              </View>

              {/* Adicionar novo tipo */}
              {!showAddLessonType ? (
                <TouchableOpacity
                  style={styles.addTypeButton}
                  onPress={() => setShowAddLessonType(true)}
                >
                  <Ionicons name="add-circle-outline" size={24} color={colors.background.brandPrimary} />
                  <Text style={styles.addTypeButtonText}>Criar novo tipo de aula</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.addTypeContainer}>
                  <TextInput
                    style={styles.addTypeInput}
                    placeholder="Nome do tipo de aula (ex: Reversão)"
                    placeholderTextColor={colors.text.placeholder}
                    value={newLessonType}
                    onChangeText={setNewLessonType}
                  />
                  <View style={styles.addTypeActions}>
                    <TouchableOpacity
                      style={styles.cancelTypeButton}
                      onPress={() => {
                        setShowAddLessonType(false);
                        setNewLessonType("");
                      }}
                    >
                      <Text style={styles.cancelTypeText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.confirmTypeButton}
                      onPress={addCustomLessonType}
                    >
                      <Text style={styles.confirmTypeText}>Adicionar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {selectedLessonTypes.length > 0 && (
                <View style={styles.selectedTypesContainer}>
                  <Text style={styles.selectedTypesLabel}>Selecionados:</Text>
                  <View style={styles.selectedTypesList}>
                    {selectedLessonTypes.map((type) => (
                      <View key={type} style={styles.selectedTypeBadge}>
                        <Text style={styles.selectedTypeText}>{type}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {currentStep === 2 && (
            <View>
              <Text style={styles.stepTitle}>Veículo</Text>
              <Text style={styles.stepSubtitle}>Escolha o veículo</Text>
              {vehicles && vehicles.length > 0 ? (
                <FlatList
                  data={vehicles}
                  keyExtractor={(item) => item.id}
                  renderItem={renderVehicle}
                  contentContainerStyle={styles.vehiclesList}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>Nenhum veículo cadastrado</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextButton, acceptMutation.isPending && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={acceptMutation.isPending}
          >
            {acceptMutation.isPending ? (
              <ActivityIndicator color={colors.text.white} />
            ) : (
              <>
                <Text style={styles.nextButtonText}>
                  {currentStep === 2 ? "Aceitar Chamadas" : "Próximo"}
                </Text>
                <Ionicons name="arrow-forward" size={20} color={colors.text.white} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
    backgroundColor: colors.background.secondary,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  stepper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing['2xl'],
    backgroundColor: colors.background.secondary,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.background.tertiary,
    justifyContent: "center",
    alignItems: "center",
  },
  stepCircleActive: {
    backgroundColor: colors.background.brandPrimary,
  },
  stepCircleCompleted: {
    backgroundColor: colors.background.brandPrimary,
  },
  stepNumber: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: colors.background.tertiary,
    marginHorizontal: spacing.xs,
  },
  stepLineCompleted: {
    backgroundColor: colors.background.brandPrimary,
  },
  content: {
    flex: 1,
    padding: spacing['2xl'],
  },
  stepTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  stepSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing['3xl'],
  },
  sectionLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  datesList: {
    paddingRight: spacing['2xl'],
  },
  dateCard: {
    width: 80,
    height: 80,
    borderRadius: radius.lg,
    backgroundColor: colors.background.tertiary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.lg,
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
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
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  dateNumberSelected: {
    color: colors.text.white,
  },
  checkmark: {
    position: "absolute",
    top: spacing.xs,
    right: spacing.xs,
  },
  selectedCount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  timeModeToggle: {
    flexDirection: "row",
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.md,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  timeModeButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  timeModeButtonActive: {
    backgroundColor: colors.background.brandPrimary,
  },
  timeModeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },
  timeModeTextActive: {
    color: colors.text.white,
  },
  periodsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  periodCard: {
    flex: 1,
    minWidth: "30%",
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.background.tertiary,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
  },
  periodCardSelected: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.background.brandPrimary,
  },
  periodText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  periodTextSelected: {
    color: colors.background.brandPrimary,
  },
  periodTime: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  periodTimeSelected: {
    color: colors.text.secondary,
  },
  customTimesList: {
    marginBottom: spacing.lg,
  },
  customTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  customTimeCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.background.tertiary,
  },
  customTimeText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  removeTimeButton: {
    padding: spacing.xs,
  },
  addCustomTimeContainer: {
    marginTop: spacing.md,
  },
  timeInputRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-end",
  },
  timeInput: {
    flex: 1,
  },
  timeInputLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  timeInputField: {
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  addTimeButton: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.background.brandPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
  timeInputHint: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  typeChip: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: colors.background.tertiary,
    borderWidth: 2,
    borderColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  typeChipSelected: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.background.brandPrimary,
  },
  typeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  typeTextSelected: {
    color: colors.background.brandPrimary,
  },
  addTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.background.tertiary,
    borderWidth: 2,
    borderColor: colors.border.brand,
    borderStyle: "dashed",
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  addTypeButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background.brandPrimary,
  },
  addTypeContainer: {
    marginBottom: spacing.lg,
  },
  addTypeInput: {
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    marginBottom: spacing.md,
  },
  addTypeActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  cancelTypeButton: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    alignItems: "center",
  },
  cancelTypeText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  confirmTypeButton: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.background.brandPrimary,
    alignItems: "center",
  },
  confirmTypeText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.white,
  },
  selectedTypesContainer: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: radius.md,
  },
  selectedTypesLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  selectedTypesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  selectedTypeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.background.brandPrimary,
  },
  selectedTypeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.white,
  },
  vehiclesList: {
    paddingBottom: spacing['2xl'],
  },
  vehicleCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: "transparent",
  },
  vehicleCardSelected: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.background.brandPrimary,
  },
  vehicleText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  vehicleTextSelected: {
    color: colors.background.brandPrimary,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.background.brandPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.xs,
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.white,
    fontWeight: typography.fontWeight.semibold,
  },
  emptyState: {
    padding: spacing['5xl'],
    alignItems: "center",
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
  },
  footer: {
    flexDirection: "row",
    padding: spacing['2xl'],
    borderTopWidth: 1,
    borderTopColor: colors.border.secondary,
    gap: spacing.lg,
    backgroundColor: colors.background.secondary,
  },
  backButton: {
    flex: 1,
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
  },
  backButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  nextButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.brandPrimary,
    padding: spacing.xl,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});
