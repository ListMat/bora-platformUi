import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

interface StepPaymentProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepPayment({ data, onUpdate, onNext, onBack }: StepPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<any>(null);

  const createAccountMutation = trpc.instructor.createStripeAccount.useMutation();
  const getOnboardingLinkMutation = trpc.instructor.getStripeOnboardingLink.useMutation();
  const { data: statusData, refetch: refetchStatus } = trpc.instructor.checkStripeStatus.useQuery(
    undefined,
    {
      enabled: false,
    }
  );

  useEffect(() => {
    // Verificar status inicial
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const result = await refetchStatus();
      if (result.data) {
        setStripeStatus(result.data);
        onUpdate({ stripeStatus: result.data });
      }
    } catch (error) {
      console.log("Stripe account not yet created");
    }
  };

  const handleConnectStripe = async () => {
    setIsLoading(true);
    try {
      // 1. Criar conta Stripe (se ainda não tem)
      if (!stripeStatus) {
        await createAccountMutation.mutateAsync({});
        Alert.alert("Sucesso", "Conta Stripe criada!");
      }

      // 2. Obter link de onboarding
      const { url } = await getOnboardingLinkMutation.mutateAsync({});

      // 3. Abrir link no navegador
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        Alert.alert(
          "Complete o Cadastro",
          "Complete o cadastro no Stripe e retorne ao app quando finalizar.",
          [
            {
              text: "OK",
              onPress: () => checkStatus(),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível conectar com Stripe");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (!stripeStatus?.chargesEnabled) {
      Alert.alert(
        "Configuração Pendente",
        "Você precisa completar o cadastro do Stripe para receber pagamentos. Deseja continuar mesmo assim?",
        [
          { text: "Voltar", style: "cancel" },
          {
            text: "Continuar",
            onPress: () => onNext(),
          },
        ]
      );
      return;
    }

    onNext();
  };

  const isStripeConnected = stripeStatus?.chargesEnabled && stripeStatus?.payoutsEnabled;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons 
          name="card-outline" 
          size={48} 
          color={isStripeConnected ? colors.background.success : colors.background.brandPrimary} 
        />
        <Text style={styles.title}>Recebimento de Pagamentos</Text>
        <Text style={styles.subtitle}>
          Configure sua conta para receber pagamentos das aulas
        </Text>
      </View>

      <View style={styles.content}>
        {isStripeConnected ? (
          <View style={styles.successContainer}>
            <View style={styles.successBadge}>
              <Ionicons name="checkmark-circle" size={64} color={colors.background.success} />
            </View>
            <Text style={styles.successTitle}>Stripe Conectado!</Text>
            <Text style={styles.successText}>
              Sua conta está pronta para receber pagamentos
            </Text>

            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status dos Pagamentos:</Text>
                <Text style={styles.infoValue}>
                  {stripeStatus.chargesEnabled ? "✅ Ativo" : "⏳ Pendente"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status dos Saques:</Text>
                <Text style={styles.infoValue}>
                  {stripeStatus.payoutsEnabled ? "✅ Ativo" : "⏳ Pendente"}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.setupContainer}>
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Por que usar o Stripe?</Text>
              
              <View style={styles.benefitItem}>
                <Ionicons name="shield-checkmark" size={24} color={colors.background.brandPrimary} />
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Seguro e Confiável</Text>
                  <Text style={styles.benefitDescription}>
                    Pagamentos protegidos e criptografados
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Ionicons name="flash" size={24} color={colors.background.brandPrimary} />
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Recebimento Rápido</Text>
                  <Text style={styles.benefitDescription}>
                    Receba seus pagamentos em até 2 dias úteis
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Ionicons name="wallet" size={24} color={colors.background.brandPrimary} />
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Múltiplas Formas de Pagamento</Text>
                  <Text style={styles.benefitDescription}>
                    Cartão de crédito, débito e PIX
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.connectButton, isLoading && styles.connectButtonDisabled]}
              onPress={handleConnectStripe}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.text.white} />
              ) : (
                <>
                  <Ionicons name="link" size={20} color={colors.text.white} />
                  <Text style={styles.connectButtonText}>Conectar com Stripe</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.hint}>
              Você será redirecionado para o Stripe para completar o cadastro
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {isStripeConnected ? "Continuar" : "Pular por Agora"}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={colors.text.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl },
  header: { alignItems: "center", marginBottom: spacing["3xl"] },
  title: { 
    fontSize: typography.fontSize["2xl"], 
    fontWeight: typography.fontWeight.bold, 
    color: colors.text.primary, 
    marginTop: spacing.lg, 
    marginBottom: spacing.sm 
  },
  subtitle: { 
    fontSize: typography.fontSize.base, 
    color: colors.text.secondary, 
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
  content: { flex: 1 },
  successContainer: { alignItems: "center" },
  successBadge: { marginBottom: spacing.xl },
  successTitle: { 
    fontSize: typography.fontSize.xl, 
    fontWeight: typography.fontWeight.bold, 
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  successText: { 
    fontSize: typography.fontSize.base, 
    color: colors.text.secondary, 
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  infoBox: { 
    width: "100%", 
    backgroundColor: colors.background.tertiary, 
    padding: spacing.xl, 
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  infoRow: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: { 
    fontSize: typography.fontSize.sm, 
    color: colors.text.secondary,
  },
  infoValue: { 
    fontSize: typography.fontSize.sm, 
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  setupContainer: {},
  benefitsContainer: { 
    backgroundColor: colors.background.tertiary, 
    padding: spacing.xl, 
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
  },
  benefitsTitle: { 
    fontSize: typography.fontSize.lg, 
    fontWeight: typography.fontWeight.bold, 
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  benefitItem: { 
    flexDirection: "row", 
    gap: spacing.md, 
    marginBottom: spacing.lg 
  },
  benefitText: { flex: 1 },
  benefitTitle: { 
    fontSize: typography.fontSize.base, 
    fontWeight: typography.fontWeight.semibold, 
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  benefitDescription: { 
    fontSize: typography.fontSize.sm, 
    color: colors.text.secondary 
  },
  connectButton: { 
    backgroundColor: colors.background.brandPrimary, 
    padding: spacing.xl, 
    borderRadius: radius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  connectButtonDisabled: { opacity: 0.6 },
  connectButtonText: { 
    color: colors.text.white, 
    fontSize: typography.fontSize.base, 
    fontWeight: typography.fontWeight.semibold 
  },
  hint: { 
    fontSize: typography.fontSize.xs, 
    color: colors.text.tertiary, 
    textAlign: "center",
    marginTop: spacing.md,
  },
  buttons: { 
    flexDirection: "row", 
    gap: spacing.md, 
    marginTop: spacing["2xl"] 
  },
  backButton: { 
    flex: 1, 
    padding: spacing.xl, 
    borderRadius: radius.md, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    gap: spacing.sm, 
    backgroundColor: colors.background.tertiary, 
    borderWidth: 1, 
    borderColor: colors.border.secondary 
  },
  backButtonText: { 
    color: colors.text.primary, 
    fontSize: typography.fontSize.base, 
    fontWeight: typography.fontWeight.semibold 
  },
  nextButton: { 
    flex: 1, 
    backgroundColor: colors.background.brandPrimary, 
    padding: spacing.xl, 
    borderRadius: radius.md, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    gap: spacing.sm 
  },
  nextButtonText: { 
    color: colors.text.white, 
    fontSize: typography.fontSize.base, 
    fontWeight: typography.fontWeight.semibold 
  },
});
