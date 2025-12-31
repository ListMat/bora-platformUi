import { useState } from "react";
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
import StepAddress from "./steps/StepAddress";
import StepPhoto from "./steps/StepPhoto";
import StepReferral from "./steps/StepReferral";
import StepTerms from "./steps/StepTerms";

const TOTAL_STEPS = 5;

interface OnboardingData {
  // Step 1
  cpf: string;
  dateOfBirth: Date | null;
  // Step 2
  zipCode: string;
  address: string;
  city: string;
  state: string;
  // Step 3
  photo?: string;
  // Step 4
  referralCode?: string;
  // Step 5
  termsAccepted: boolean;
}

export default function OnboardingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    cpf: "",
    dateOfBirth: null,
    zipCode: "",
    address: "",
    city: "",
    state: "",
    termsAccepted: false,
  });

  const createStudent = trpc.student.create.useMutation();

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
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OnboardingFlow.tsx:handleSubmit:entry',message:'Submit started',data:{hasDateOfBirth:!!data.dateOfBirth,termsAccepted:data.termsAccepted,cpfLength:data.cpf.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      if (!data.dateOfBirth) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OnboardingFlow.tsx:handleSubmit:validation-error',message:'Date of birth missing',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        Alert.alert("Erro", "Data de nascimento é obrigatória");
        return;
      }

      if (!data.termsAccepted) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OnboardingFlow.tsx:handleSubmit:validation-error',message:'Terms not accepted',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        Alert.alert("Erro", "Você deve aceitar os termos e condições");
        return;
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OnboardingFlow.tsx:handleSubmit:before-mutation',message:'Before calling createStudent mutation',data:{cpf:data.cpf,dateOfBirth:data.dateOfBirth?.toISOString(),address:data.address,city:data.city,state:data.state,zipCode:data.zipCode},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      await createStudent.mutateAsync({
        cpf: data.cpf,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        referralCode: data.referralCode,
      });
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OnboardingFlow.tsx:handleSubmit:success',message:'Student creation successful',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion

      Alert.alert(
        "Sucesso!",
        "Seu cadastro foi concluído com sucesso! Você ganhou 25 pontos por completar seu perfil.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/profile"),
          },
        ]
      );
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OnboardingFlow.tsx:handleSubmit:error',message:'Student creation failed',data:{errorMessage:error.message,errorStack:error.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      Alert.alert("Erro", error.message || "Erro ao criar perfil");
    }
  };

  const renderStep = () => {
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
          <StepAddress
            data={data}
            onUpdate={updateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <StepPhoto
            data={data}
            onUpdate={updateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <StepReferral
            data={data}
            onUpdate={updateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <StepTerms
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Complete seu Cadastro</Text>
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
        {renderStep()}
      </ScrollView>

      {/* Loading Overlay */}
      {createStudent.isLoading && (
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

