import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

const BRANDS = [
  "Toyota", "Honda", "Volkswagen", "Hyundai", "Chevrolet", "Fiat",
  "Ford", "Renault", "Nissan", "Jeep", "Peugeot", "Citroën",
  "BMW", "Mercedes", "Audi", "Yamaha", "Kawasaki", "Suzuki",
];

const BRAND_MODELS: Record<string, string[]> = {
  Toyota: ["Corolla", "Etios", "Hilux", "SW4", "Yaris"],
  Honda: ["Civic", "Fit", "HR-V", "City", "Accord", "CG 160", "CB 600F", "CB 1000R"],
  Volkswagen: ["Gol", "Polo", "T-Cross", "Virtus", "Jetta", "Nivus"],
  Hyundai: ["HB20", "Creta", "Tucson", "Elantra", "ix35"],
  Chevrolet: ["Onix", "Tracker", "S10", "Spin", "Cruze"],
  Fiat: ["Argo", "Mobi", "Toro", "Cronos", "Strada"],
  Ford: ["Ka", "EcoSport", "Ranger", "Focus"],
  Renault: ["Kwid", "Sandero", "Duster", "Logan", "Captur"],
  Nissan: ["Kicks", "Versa", "Sentra", "Frontier"],
  Jeep: ["Renegade", "Compass", "Commander"],
  Peugeot: ["208", "2008", "3008"],
  Citroën: ["C3", "C4 Cactus", "Aircross"],
  BMW: ["320i", "X1", "X3"],
  Mercedes: ["Classe A", "Classe C", "GLA"],
  Audi: ["A3", "A4", "Q3"],
  Yamaha: ["Fazer 250", "MT-03", "MT-07", "R1"],
  Kawasaki: ["Ninja 300", "Ninja 650", "Z650"],
  Suzuki: ["GSX-R1000", "SV650", "V-Strom"],
};

const CATEGORIES = [
  { value: "HATCH", label: "Hatch" },
  { value: "SEDAN", label: "Sedan" },
  { value: "SUV", label: "SUV" },
  { value: "PICKUP", label: "Pick-up" },
  { value: "SPORTIVO", label: "Sportivo" },
  { value: "COMPACTO", label: "Compacto" },
  { value: "ELETRICO", label: "Elétrico" },
  { value: "MOTO", label: "Moto" },
];

const TRANSMISSIONS = [
  { value: "MANUAL", label: "Manual" },
  { value: "AUTOMATICO", label: "Automático" },
  { value: "CVT", label: "CVT" },
  { value: "SEMI_AUTOMATICO", label: "Semi-automático" },
];

const FUELS = [
  { value: "GASOLINA", label: "Gasolina" },
  { value: "ETANOL", label: "Etanol" },
  { value: "FLEX", label: "Flex" },
  { value: "DIESEL", label: "Diesel" },
  { value: "ELETRICO", label: "Elétrico" },
  { value: "HIBRIDO", label: "Híbrido" },
];

const COLORS = [
  "Branco", "Preto", "Prata", "Cinza", "Vermelho", "Azul",
  "Amarelo", "Laranja", "Verde", "Marrom", "Bege", "Roxo",
];

const ENGINES = [
  "1.0", "1.3", "1.4", "1.6", "1.8", "2.0", "2.0 Flex", "2.5", "3.0", "Elétrico",
  "125cc", "150cc", "250cc", "300cc", "500cc", "600cc", "750cc", "1000cc",
];

// Custom Picker Component
interface CustomPickerProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }> | string[];
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function CustomPicker({ label, value, options, onSelect, placeholder, disabled }: CustomPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  
  const optionsList = options.map((opt) => 
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );
  
  const selectedLabel = optionsList.find((opt) => opt.value === value)?.label || placeholder || "Selecione";

  return (
    <>
      <TouchableOpacity
        style={[styles.pickerButton, disabled && styles.pickerButtonDisabled]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Text style={[styles.pickerButtonText, !value && styles.pickerButtonTextPlaceholder]}>
          {selectedLabel}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.text.secondary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={optionsList}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    value === item.value && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    onSelect(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      value === item.value && styles.modalItemTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {value === item.value && (
                    <Ionicons name="checkmark" size={20} color={colors.background.brandPrimary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

export default function AddVehicleScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  // Step 0: Tipo de veículo
  const [vehicleType, setVehicleType] = useState<"CARRO" | "MOTO" | null>(null);

  // Form data
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [plateLastFour, setPlateLastFour] = useState("");
  const [category, setCategory] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuel, setFuel] = useState("");
  const [engine, setEngine] = useState("");
  const [hasDualPedal, setHasDualPedal] = useState(true); // Obrigatório para instrutor
  const [photoBase64, setPhotoBase64] = useState("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="); // Placeholder base64

  const availableModels = brand ? (BRAND_MODELS[brand] || []) : [];

  const createVehicleMutation = trpc.vehicle.create.useMutation({
    onSuccess: () => {
      Alert.alert("Sucesso", "Veículo cadastrado com sucesso!");
      router.back();
    },
    onError: (error) => {
      Alert.alert("Erro", error.message || "Erro ao cadastrar veículo");
    },
  });

  const handleNext = () => {
    if (currentStep === 0) {
      // Validar Step 0: Tipo de veículo
      if (!vehicleType) {
        Alert.alert("Erro", "Selecione o tipo de veículo");
        return;
      }
      // Auto-selecionar categoria baseado no tipo
      if (vehicleType === "MOTO") {
        setCategory("MOTO");
      }
      setCurrentStep(1);
      return;
    } else if (currentStep === 1) {
      // Validar Step 1: Dados básicos
      if (!brand || !model || !year || !color || !plateLastFour) {
        Alert.alert("Erro", "Preencha todos os campos obrigatórios");
        return;
      }
      const plateRegex = /^[A-Z0-9]{4}$/;
      if (!plateRegex.test(plateLastFour.toUpperCase())) {
        Alert.alert("Erro", "Placa deve ter 4 caracteres alfanuméricos");
        return;
      }
    } else if (currentStep === 2) {
      // Validar Step 2: Especificações
      if (!category || (vehicleType === "CARRO" && !transmission) || !fuel || !engine) {
        Alert.alert("Erro", "Preencha todos os campos obrigatórios");
        return;
      }
    }

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < 1980 || yearNum > 2026) {
      Alert.alert("Erro", "Ano deve estar entre 1980 e 2026");
      return;
    }

    // Garantir que a categoria está correta baseada no tipo
    const finalCategory = vehicleType === "MOTO" ? "MOTO" : category;

    createVehicleMutation.mutate({
      brand,
      model,
      year: yearNum,
      color,
      plateLastFour: plateLastFour.toUpperCase(),
      photoBase64,
      category: finalCategory as any,
      transmission: (isMoto ? "MANUAL" : transmission) as any,
      fuel: fuel as any,
      engine,
      hasDualPedal: isMoto ? false : hasDualPedal,
      pedalPhotoBase64: isMoto ? undefined : (hasDualPedal ? photoBase64 : undefined),
      acceptStudentCar: false,
      safetyFeatures: [],
      comfortFeatures: [],
    });
  };

  const isMoto = vehicleType === "MOTO" || category === "MOTO";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastrar Veículo</Text>
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

      <ScrollView style={styles.content}>
        {currentStep === 0 && (
          <View>
            <Text style={styles.stepTitle}>Tipo de Veículo</Text>
            <Text style={styles.stepSubtitle}>Selecione o tipo de veículo que deseja cadastrar</Text>

            <View style={styles.vehicleTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.vehicleTypeCard,
                  vehicleType === "CARRO" && styles.vehicleTypeCardSelected,
                ]}
                onPress={() => setVehicleType("CARRO")}
              >
                <Ionicons
                  name="car"
                  size={48}
                  color={vehicleType === "CARRO" ? colors.background.brandPrimary : colors.text.tertiary}
                />
                <Text
                  style={[
                    styles.vehicleTypeText,
                    vehicleType === "CARRO" && styles.vehicleTypeTextSelected,
                  ]}
                >
                  Carro
                </Text>
                <Text style={styles.vehicleTypeSubtext}>
                  Manual ou Automático
                </Text>
                {vehicleType === "CARRO" && (
                  <View style={styles.selectedBadge}>
                    <Ionicons name="checkmark-circle" size={24} color={colors.background.brandPrimary} />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.vehicleTypeCard,
                  vehicleType === "MOTO" && styles.vehicleTypeCardSelected,
                ]}
                onPress={() => setVehicleType("MOTO")}
              >
                <Ionicons
                  name="bicycle"
                  size={48}
                  color={vehicleType === "MOTO" ? colors.background.brandPrimary : colors.text.tertiary}
                />
                <Text
                  style={[
                    styles.vehicleTypeText,
                    vehicleType === "MOTO" && styles.vehicleTypeTextSelected,
                  ]}
                >
                  Moto
                </Text>
                <Text style={styles.vehicleTypeSubtext}>
                  Motocicleta ou Motoneta
                </Text>
                {vehicleType === "MOTO" && (
                  <View style={styles.selectedBadge}>
                    <Ionicons name="checkmark-circle" size={24} color={colors.background.brandPrimary} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentStep === 1 && (
          <View>
            <Text style={styles.stepTitle}>Dados Básicos</Text>
            <Text style={styles.stepSubtitle}>Informe os dados do veículo</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Marca *</Text>
              <CustomPicker
                label="Marca"
                value={brand}
                options={BRANDS}
                onSelect={(value) => {
                  setBrand(value);
                  setModel(""); // Reset model when brand changes
                }}
                placeholder="Selecione a marca"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Modelo *</Text>
              <CustomPicker
                label="Modelo"
                value={model}
                options={availableModels}
                onSelect={setModel}
                placeholder="Selecione o modelo"
                disabled={!brand}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Ano *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 2020"
                placeholderTextColor={colors.text.placeholder}
                value={year}
                onChangeText={setYear}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Cor *</Text>
              <CustomPicker
                label="Cor"
                value={color}
                options={COLORS}
                onSelect={setColor}
                placeholder="Selecione a cor"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Últimos 4 dígitos da placa *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 1D23"
                placeholderTextColor={colors.text.placeholder}
                value={plateLastFour}
                onChangeText={(text) => setPlateLastFour(text.toUpperCase())}
                maxLength={4}
                autoCapitalize="characters"
              />
            </View>
          </View>
        )}

        {currentStep === 2 && (
          <View>
            <Text style={styles.stepTitle}>Especificações</Text>
            <Text style={styles.stepSubtitle}>Informe as especificações técnicas</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Categoria *</Text>
              <CustomPicker
                label="Categoria"
                value={category}
                options={vehicleType === "MOTO" ? [{ value: "MOTO", label: "Moto" }] : CATEGORIES.filter(c => c.value !== "MOTO")}
                onSelect={setCategory}
                placeholder="Selecione a categoria"
                disabled={vehicleType === "MOTO"}
              />
              {vehicleType === "MOTO" && (
                <Text style={styles.helperText}>
                  Categoria definida automaticamente como Moto
                </Text>
              )}
            </View>

            {!isMoto && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Câmbio *</Text>
                <CustomPicker
                  label="Câmbio"
                  value={transmission}
                  options={TRANSMISSIONS}
                  onSelect={setTransmission}
                  placeholder="Selecione o câmbio"
                />
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Combustível *</Text>
              <CustomPicker
                label="Combustível"
                value={fuel}
                options={FUELS}
                onSelect={setFuel}
                placeholder="Selecione o combustível"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Motor *</Text>
              <CustomPicker
                label="Motor"
                value={engine}
                options={ENGINES}
                onSelect={setEngine}
                placeholder="Selecione o motor"
              />
            </View>

            {!isMoto && (
              <View style={styles.formGroup}>
                <View style={styles.checkboxRow}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => setHasDualPedal(!hasDualPedal)}
                  >
                    {hasDualPedal && (
                      <Ionicons name="checkmark" size={20} color={colors.background.brandPrimary} />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>
                    Duplo-pedal instalado (obrigatório para instrutores)
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color={colors.background.brandPrimary} />
              <Text style={styles.infoText}>
                A funcionalidade de upload de foto será implementada em breve. Por enquanto, você pode cadastrar o veículo sem foto.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

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
          style={[styles.nextButton, createVehicleMutation.isPending && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={createVehicleMutation.isPending}
        >
          {createVehicleMutation.isPending ? (
            <ActivityIndicator color={colors.text.white} />
          ) : (
            <>
              <Text style={styles.nextButtonText}>
                {currentStep === 2 ? "Cadastrar" : "Próximo"}
              </Text>
              <Ionicons name="arrow-forward" size={20} color={colors.text.white} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
  formGroup: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  pickerButtonDisabled: {
    opacity: 0.5,
  },
  pickerButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  pickerButtonTextPlaceholder: {
    color: colors.text.placeholder,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
  },
  modalItemSelected: {
    backgroundColor: colors.background.tertiary,
  },
  modalItemText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  modalItemTextSelected: {
    color: colors.background.brandPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.xs,
    borderWidth: 2,
    borderColor: colors.border.secondary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: radius.md,
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  helperText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
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
  vehicleTypeContainer: {
    flexDirection: "row",
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  vehicleTypeCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: radius.lg,
    padding: spacing['2xl'],
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
    minHeight: 180,
    justifyContent: "center",
  },
  vehicleTypeCardSelected: {
    borderColor: colors.background.brandPrimary,
    backgroundColor: colors.background.tertiary,
  },
  vehicleTypeText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  vehicleTypeTextSelected: {
    color: colors.background.brandPrimary,
  },
  vehicleTypeSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: "center",
  },
  selectedBadge: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
  },
});
