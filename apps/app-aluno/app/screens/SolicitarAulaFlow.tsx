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
import StepWhen from "./steps/StepWhen";
import StepPlanPayment from "./steps/StepPlanPayment";

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
    lessonType: "1ª Habilitação",
    vehicleId: null as string | null,
    useOwnVehicle: false,
    planId: null as string | null,
    paymentMethod: "PIX" as "PIX" | "DINHEIRO" | "DEBITO" | "CREDITO",
    price: 79,
  });

  const utils = trpc.useUtils();
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  
  const requestMutation = trpc.lesson.request.useMutation({
    onSuccess: async (data) => {
      try {
        await sendMessageMutation.mutateAsync({
          lessonId: data.lesson.id,
          content: data.initialMessage,
        });
      } catch (error) {
        console.error("Error sending initial message:", error);
      }

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

  const steps = [
    { component: StepWhen, title: "Quando?" },
    { component: StepPlanPayment, title: "Plano & Pagamento" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!formData.date || !formData.time || !instructorId) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios");
      return;
    }

    const scheduledAt = new Date(formData.date);
    const [hours, minutes] = formData.time.split(":").map(Number);
    scheduledAt.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    if (scheduledAt < twoHoursFromNow) {
      Alert.alert("Erro", "A aula deve ser agendada com pelo menos 2 horas de antecedência");
      return;
    }

    // Salvar última configuração para "Aula em 1 clique"
    try {
      await AsyncStorage.setItem('last_lesson_config', JSON.stringify({
        time: formData.time,
        lessonType: formData.lessonType,
        planId: formData.planId,
        paymentMethod: formData.paymentMethod,
        price: formData.price,
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
    });
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const CurrentStepComponent = steps[currentStep].component;

  const content = (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { haptic.light(); handleBack(); }} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.background.brandPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Solicitar Aula</Text>
        <TouchableOpacity onPress={() => { haptic.light(); onClose(); }} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Stepper */}
      <View style={styles.stepper}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View
              style={[
                styles.stepCircle,
                index === currentStep && styles.stepCircleActive,
                index < currentStep && styles.stepCircleCompleted,
              ]}
            >
              {index < currentStep ? (
                <Ionicons name="checkmark" size={16} color={colors.text.white} />
              ) : (
                <Text style={styles.stepNumber}>{index + 1}</Text>
              )}
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  index < currentStep && styles.stepLineCompleted,
                ]}
              />
            )}
          </View>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
    backgroundColor: colors.background.secondary,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.sm,
  },
  stepper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing["2xl"],
    paddingHorizontal: spacing.xl,
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
    padding: spacing["2xl"],
  },
  footer: {
    padding: spacing["2xl"],
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
  },
  nextButtonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  confirmButton: {
    backgroundColor: colors.background.brandPrimary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    borderRadius: radius.xl,
    gap: spacing.sm,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  footerNote: {
    marginTop: spacing.lg,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    textAlign: "center",
  },
});
