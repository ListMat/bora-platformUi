import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { trpc } from "@/lib/trpc";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";
import { useHaptic } from "@/hooks/useHaptic";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import all step components
import StepDateTime from "./steps/StepDateTime";
import StepLessonType from "./steps/StepLessonType";
import StepVehicle from "./steps/StepVehicle";
import StepPlan from "./steps/StepPlan";
import StepPayment from "./steps/StepPayment";
import StepConfirm from "./steps/StepConfirm";

interface SolicitarAulaFlowProps {
  visible?: boolean;
  onClose?: () => void;
  instructorId?: string;
}

export default function SolicitarAulaFlow(props?: SolicitarAulaFlowProps) {
  const router = useRouter();
  const haptic = useHaptic();
  const params = useLocalSearchParams<{ instructorId?: string }>();
  const instructorId = props?.instructorId || params.instructorId;
  const isModal = props?.visible !== undefined;
  const visible = isModal ? (props?.visible ?? true) : true;
  const onClose = props?.onClose || (() => router.back());

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    date: null as Date | null,
    time: "",
    lessonType: "1ª Habilitação", // Pre-selected
    vehicleId: null as string | null,
    useOwnVehicle: false,
    planId: "1" as string | null, // Default to 1 lesson
    paymentMethod: "PIX" as "PIX" | "DINHEIRO" | "DEBITO" | "CREDITO",
    price: 79,
    installments: 1,
  });

  const utils = trpc.useUtils();
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  const requestMutation = trpc.lesson.request.useMutation({
    onSuccess: async (data) => {
      try {
        // Send initial message to chat
        await sendMessageMutation.mutateAsync({
          lessonId: data.lesson.id,
          content: data.initialMessage,
        });
      } catch (error) {
        console.error("Error sending initial message:", error);
      }

      // Redirect to chat with instructor
      router.push({
        pathname: "/screens/lessonChat",
        params: { lessonId: data.lesson.id },
      });
      onClose();
    },
    onError: (error) => {
      Alert.alert("Erro", error.message || "Erro ao solicitar aula");
    },
  });

  // Define all 6 steps
  const steps = [
    { component: StepDateTime, title: "Data & Horário", key: "datetime" },
    { component: StepLessonType, title: "Tipo de Aula", key: "lessontype" },
    { component: StepVehicle, title: "Veículo", key: "vehicle" },
    { component: StepPlan, title: "Plano", key: "plan" },
    { component: StepPayment, title: "Pagamento", key: "payment" },
    { component: StepConfirm, title: "Confirmação", key: "confirm" },
  ];

  const handleNext = () => {
    haptic.light();

    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    haptic.light();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // DateTime
        if (!formData.date || !formData.time) {
          Alert.alert("Atenção", "Selecione a data e horário da aula");
          return false;
        }
        // Validate minimum 2 hours in advance
        const scheduledAt = new Date(formData.date);
        const [hours, minutes] = formData.time.split(":").map(Number);
        scheduledAt.setHours(hours, minutes, 0, 0);

        const now = new Date();
        const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        if (scheduledAt < twoHoursFromNow) {
          Alert.alert("Atenção", "A aula deve ser agendada com pelo menos 2 horas de antecedência");
          return false;
        }
        break;

      case 1: // LessonType
        if (!formData.lessonType) {
          Alert.alert("Atenção", "Selecione o tipo de aula");
          return false;
        }
        break;

      case 2: // Vehicle
        if (!formData.vehicleId && !formData.useOwnVehicle) {
          Alert.alert("Atenção", "Selecione um veículo");
          return false;
        }
        break;

      case 3: // Plan
        if (!formData.planId) {
          Alert.alert("Atenção", "Selecione um plano");
          return false;
        }
        break;

      case 4: // Payment
        if (!formData.paymentMethod) {
          Alert.alert("Atenção", "Selecione a forma de pagamento");
          return false;
        }
        break;
    }
    return true;
  };

  const handleConfirm = async () => {
    if (!instructorId) {
      Alert.alert("Erro", "Instrutor não encontrado");
      return;
    }

    haptic.heavy();

    const scheduledAt = new Date(formData.date!);
    const [hours, minutes] = formData.time.split(":").map(Number);
    scheduledAt.setHours(hours, minutes, 0, 0);

    // Save last configuration for "1-click lesson"
    try {
      await AsyncStorage.setItem('last_lesson_config', JSON.stringify({
        time: formData.time,
        lessonType: formData.lessonType,
        planId: formData.planId,
        paymentMethod: formData.paymentMethod,
        price: formData.price,
        installments: formData.installments,
      }));
    } catch (error) {
      console.error("Error saving last config:", error);
    }

    requestMutation.mutate({
      instructorId: instructorId!,
      scheduledAt,
      lessonType: formData.lessonType,
      vehicleId: formData.vehicleId || undefined,
      useOwnVehicle: formData.useOwnVehicle,
      planId: formData.planId || undefined,
      paymentMethod: formData.paymentMethod,
      price: formData.price,
      installments: formData.installments,
    });
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const content = (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.background.brandPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Solicitar Aula</Text>
          <Text style={styles.headerSubtitle}>
            Passo {currentStep + 1} de {steps.length}
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      {/* Stepper Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stepper}
      >
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <View key={index} style={styles.stepPill}>
              <View
                style={[
                  styles.stepCircle,
                  isActive && styles.stepCircleActive,
                  isCompleted && styles.stepCircleCompleted,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color={colors.text.white} />
                ) : (
                  <Text style={[styles.stepNumber, isActive && styles.stepNumberActive]}>
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text style={[styles.stepTitle, isActive && styles.stepTitleActive]}>
                {step.title}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <CurrentStepComponent
          formData={formData}
          updateFormData={updateFormData}
          instructorId={instructorId || ""}
          onNext={handleNext}
        />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {currentStep < steps.length - 1 ? (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            disabled={requestMutation.isPending}
          >
            <Text style={styles.nextButtonText}>Próximo</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.text.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.confirmButton, requestMutation.isPending && styles.confirmButtonDisabled]}
            onPress={handleConfirm}
            disabled={requestMutation.isPending}
          >
            {requestMutation.isPending ? (
              <ActivityIndicator color={colors.text.white} />
            ) : (
              <>
                <Text style={styles.confirmButtonText}>Confirmar Solicitação</Text>
                <Ionicons name="checkmark-circle" size={20} color={colors.text.white} />
              </>
            )}
          </TouchableOpacity>
        )}
        <Text style={styles.footerNote}>
          Você só pagará ao final da aula.
        </Text>
      </View>
    </View>
  );

  if (isModal) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
        {content}
      </Modal>
    );
  }

  return content;
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
    paddingTop: spacing["2xl"],
    backgroundColor: colors.background.secondary,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xxs,
  },
  closeButton: {
    padding: spacing.sm,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.background.tertiary,
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.background.brandPrimary,
    borderRadius: radius.full,
  },
  stepper: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.background.secondary,
  },
  stepPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.full,
    gap: spacing.sm,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.background.quaternary,
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
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.tertiary,
  },
  stepNumberActive: {
    color: colors.text.white,
  },
  stepTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.tertiary,
  },
  stepTitleActive: {
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing["2xl"],
  },
  footer: {
    padding: spacing["2xl"],
    paddingBottom: spacing["3xl"],
    borderTopWidth: 1,
    borderTopColor: colors.border.secondary,
    backgroundColor: colors.background.secondary,
  },
  nextButton: {
    backgroundColor: colors.background.brandPrimary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    borderRadius: radius.xl,
    gap: spacing.sm,
    shadowColor: colors.background.brandPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  confirmButton: {
    backgroundColor: colors.background.brandPrimary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    borderRadius: radius.xl,
    gap: spacing.sm,
    shadowColor: colors.background.brandPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  footerNote: {
    marginTop: spacing.lg,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    textAlign: "center",
  },
});
