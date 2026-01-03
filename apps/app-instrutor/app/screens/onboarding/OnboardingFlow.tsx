import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { trpc } from "@/lib/trpc";
import { colors, spacing, radius, typography } from "@/theme";
import StepPersonalData from "./steps/StepPersonalData";
import StepDocuments from "./steps/StepDocuments";
import StepLocation from "./steps/StepLocation";
import StepPricing from "./steps/StepPricing";
import StepAvailability from "./steps/StepAvailability";
import StepPayment from "./steps/StepPayment";

const TOTAL_STEPS = 6;

interface OnboardingData {
  // Step 1
  cpf: string;
  phone: string;
  // Step 2
  cnhNumber: string;
  credentialNumber: string;
  credentialExpiry: Date | null;
  cnhDocument?: string;
  credentialDocument?: string;
  // Step 3
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  // Step 4
  basePrice: number;
  // Step 5
  availability?: any;
  // Step 6
  stripeOnboarded?: boolean;
}

export default function OnboardingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    cpf: "",
    phone: "",
    cnhNumber: "",
    credentialNumber: "",
    credentialExpiry: null,
    city: "",
    state: "",
    basePrice: 100,
  });

  // Queries e Mutations
  const { data: existingProfile, isLoading: isLoadingProfile } = trpc.instructor.getMyProfile.useQuery(undefined, { retry: false });

  const createInstructor = trpc.instructor.create.useMutation();
  const updateInstructor = trpc.instructor.update.useMutation();
  const uploadCNH = trpc.instructor.uploadDocument.useMutation();
  const uploadCredential = trpc.instructor.uploadDocument.useMutation();
  const updateLocation = trpc.instructor.updateLocation.useMutation();

  // Carregar dados existentes
  useEffect(() => {
    if (existingProfile) {
      setData({
        cpf: existingProfile.cpf || "",
        phone: existingProfile.user?.phone || "",
        cnhNumber: existingProfile.cnhNumber || "",
        credentialNumber: existingProfile.credentialNumber || "",
        credentialExpiry: existingProfile.credentialExpiry ? new Date(existingProfile.credentialExpiry) : null,
        cnhDocument: existingProfile.cnhDocument || undefined,
        credentialDocument: existingProfile.credentialDoc || undefined,
        city: existingProfile.city || "",
        state: existingProfile.state || "",
        latitude: existingProfile.latitude || undefined,
        longitude: existingProfile.longitude || undefined,
        basePrice: existingProfile.basePrice || 100,
        stripeOnboarded: !!existingProfile.stripeAccountId,
      });
    }
  }, [existingProfile]);

  const updateData = (stepData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...stepData }));
  };

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    try {
      let instructorId;

      if (existingProfile) {
        // MODO EDIÇÃO: Atualizar dados permitidos
        const updated = await updateInstructor.mutateAsync({
          city: data.city,
          state: data.state,
          basePrice: data.basePrice,
          phone: data.phone,
        });
        instructorId = updated.id;
      } else {
        // MODO CRIAÇÃO: Criar novo perfil
        if (!data.credentialExpiry) {
          Alert.alert("Erro", "Data de validade da credencial é obrigatória");
          return;
        }

        const newInstructor = await createInstructor.mutateAsync({
          cpf: data.cpf,
          cnhNumber: data.cnhNumber,
          credentialNumber: data.credentialNumber,
          credentialExpiry: data.credentialExpiry,
          city: data.city,
          state: data.state,
          basePrice: data.basePrice,
          phone: data.phone,
        });
        instructorId = newInstructor.id;
      }

      // Upload de documentos (apenas se for novo upload - base64)
      if (data.cnhDocument && data.cnhDocument.startsWith('data:')) {
        try {
          await uploadCNH.mutateAsync({
            documentType: "cnh",
            documentBase64: data.cnhDocument,
          });
        } catch (error) {
          console.error("Error uploading CNH:", error);
        }
      }

      if (data.credentialDocument && data.credentialDocument.startsWith('data:')) {
        try {
          await uploadCredential.mutateAsync({
            documentType: "credential",
            documentBase64: data.credentialDocument,
          });
        } catch (error) {
          console.error("Error uploading credential:", error);
        }
      }

      // Atualizar localização se disponível e alterada
      if (data.latitude && data.longitude) {
        await updateLocation.mutateAsync({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }

      Alert.alert(
        "Sucesso!",
        existingProfile
          ? "Seu perfil foi atualizado com sucesso."
          : "Seu cadastro foi enviado para análise. Você receberá uma notificação quando for aprovado.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/profile"),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao salvar perfil");
    }
  };

  const renderStep = () => {
    // Se estiver carregando perfil, mostrar loading
    if (isLoadingProfile) return null;

    switch (currentStep) {
      case 1:
        return (
          <StepPersonalData
            data={data}
            onUpdate={updateData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <StepDocuments
            data={data}
            onUpdate={updateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <StepLocation
            data={data}
            onUpdate={updateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <StepPricing
            data={data}
            onUpdate={updateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <StepAvailability
            data={data}
            onUpdate={updateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <StepPayment
            data={data}
            onUpdate={updateData}
            onNext={handleSubmit}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  const isSaving =
    createInstructor.isLoading ||
    updateInstructor.isLoading ||
    uploadCNH.isLoading ||
    uploadCredential.isLoading ||
    updateLocation.isLoading;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {existingProfile ? "Editar Instrutor" : "Cadastro de Instrutor"}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentStep / TOTAL_STEPS) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Passo {currentStep} de {TOTAL_STEPS}
        </Text>
      </View>

      {/* Step Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {isLoadingProfile ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.background.brandPrimary} />
            <Text style={styles.loadingText}>Carregando dados...</Text>
          </View>
        ) : (
          renderStep()
        )}
      </ScrollView>

      {/* Loading Overlay */}
      {isSaving && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.background.brandPrimary} />
          <Text style={styles.loadingText}>Processando...</Text>
        </View>
      )}
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
    paddingTop: spacing["2xl"],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    padding: spacing.xl,
    paddingBottom: spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.full,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.background.brandPrimary,
    borderRadius: radius.full,
  },
  progressText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.xl,
    paddingBottom: spacing["4xl"],
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background.primary + "E6",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
});

