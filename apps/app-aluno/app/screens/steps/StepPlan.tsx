import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";
import { trpc } from "@/lib/trpc";

interface StepPlanProps {
  formData: {
    planId: string | null;
    price: number;
    installments: number;
  };
  updateFormData: (data: any) => void;
  instructorId: string;
  onNext: () => void;
}

const PLANS = [
  {
    id: "1",
    lessons: 1,
    price: 79,
    discount: 0,
    tag: null,
  },
  {
    id: "5",
    lessons: 5,
    price: 355,
    originalPrice: 395,
    discount: 10,
    tag: "-10%",
  },
  {
    id: "10",
    lessons: 10,
    price: 672,
    originalPrice: 790,
    discount: 15,
    tag: "-15%",
  },
];

export default function StepPlan({ formData, updateFormData, instructorId, onNext }: StepPlanProps) {
  // Fetch plans from API (optional - using static data for now)
  const { data: plansData, isLoading } = trpc.plan.list.useQuery(
    {},
    { enabled: false } // Using static data
  );

  const handleSelectPlan = (plan: typeof PLANS[0]) => {
    updateFormData({
      planId: plan.id,
      price: plan.price,
      installments: 1, // Default to 1x
    });
  };

  const handleInstallmentChange = (installments: number) => {
    updateFormData({ installments });
  };

  const selectedPlan = PLANS.find(p => p.planId === formData.planId);
  const canInstall = formData.price >= 200;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plano</Text>
      <Text style={styles.subtitle}>Escolha quantas aulas você quer</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.background.brandPrimary} />
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.plansScroll}
          >
            {PLANS.map((plan) => {
              const isSelected = formData.planId === plan.id;
              const pricePerLesson = plan.price / plan.lessons;

              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    isSelected && styles.planCardSelected,
                    plan.tag && styles.planCardFeatured,
                  ]}
                  onPress={() => handleSelectPlan(plan)}
                >
                  {/* Discount Tag */}
                  {plan.tag && (
                    <View style={styles.discountTag}>
                      <Text style={styles.discountTagText}>{plan.tag}</Text>
                    </View>
                  )}

                  {/* Lessons Count */}
                  <View style={styles.planHeader}>
                    <Text style={[styles.lessonCount, isSelected && styles.lessonCountSelected]}>
                      {plan.lessons}
                    </Text>
                    <Text style={[styles.lessonLabel, isSelected && styles.lessonLabelSelected]}>
                      {plan.lessons === 1 ? "aula" : "aulas"}
                    </Text>
                  </View>

                  {/* Price */}
                  <View style={styles.priceContainer}>
                    {plan.originalPrice && (
                      <Text style={styles.originalPrice}>
                        R$ {plan.originalPrice.toFixed(2)}
                      </Text>
                    )}
                    <Text style={[styles.price, isSelected && styles.priceSelected]}>
                      R$ {plan.price.toFixed(2)}
                    </Text>
                    <Text style={[styles.pricePerLesson, isSelected && styles.pricePerLessonSelected]}>
                      R$ {pricePerLesson.toFixed(2)}/aula
                    </Text>
                  </View>

                  {/* Savings */}
                  {plan.discount > 0 && (
                    <View style={styles.savingsContainer}>
                      <Ionicons name="trending-down" size={16} color={colors.text.success} />
                      <Text style={styles.savingsText}>
                        Economize R$ {(plan.originalPrice! - plan.price).toFixed(2)}
                      </Text>
                    </View>
                  )}

                  {/* Popular Badge */}
                  {plan.lessons === 5 && (
                    <View style={styles.popularBadge}>
                      <Ionicons name="star" size={12} color={colors.text.white} />
                      <Text style={styles.popularText}>Mais popular</Text>
                    </View>
                  )}

                  {isSelected && (
                    <View style={styles.selectedCheck}>
                      <Ionicons name="checkmark-circle" size={24} color={colors.background.brandPrimary} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Installment Options */}
          {canInstall && formData.planId && (
            <View style={styles.installmentSection}>
              <Text style={styles.sectionTitle}>Parcelamento</Text>
              <Text style={styles.sectionSubtitle}>Sem juros no Pix ou Cartão</Text>

              <View style={styles.installmentOptions}>
                {[1, 2, 3].map((installment) => {
                  const isSelected = formData.installments === installment;
                  const installmentValue = formData.price / installment;

                  return (
                    <TouchableOpacity
                      key={installment}
                      style={[
                        styles.installmentOption,
                        isSelected && styles.installmentOptionSelected,
                      ]}
                      onPress={() => handleInstallmentChange(installment)}
                    >
                      <View style={styles.installmentInfo}>
                        <Text style={[styles.installmentText, isSelected && styles.installmentTextSelected]}>
                          {installment}x
                        </Text>
                        <Text style={[styles.installmentValue, isSelected && styles.installmentValueSelected]}>
                          R$ {installmentValue.toFixed(2)}
                        </Text>
                      </View>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={20} color={colors.background.brandPrimary} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.infoNote}>
                <Ionicons name="information-circle-outline" size={16} color={colors.text.tertiary} />
                <Text style={styles.infoText}>
                  Parcelamento disponível apenas para valores acima de R$ 200
                </Text>
              </View>
            </View>
          )}

          {/* Benefits */}
          <View style={styles.benefitsSection}>
            <Text style={styles.sectionTitle}>Benefícios</Text>

            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.background.brandPrimary} />
                <Text style={styles.benefitText}>Aulas válidas por 6 meses</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.background.brandPrimary} />
                <Text style={styles.benefitText}>Remarcação gratuita até 2h antes</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.background.brandPrimary} />
                <Text style={styles.benefitText}>Instrutores certificados</Text>
              </View>
              {selectedPlan && selectedPlan.lessons >= 5 && (
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.background.brandPrimary} />
                  <Text style={styles.benefitText}>1 aula bônus de revisão</Text>
                </View>
              )}
            </View>
          </View>
        </>
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
  plansScroll: {
    gap: spacing.lg,
    paddingRight: spacing.xl,
    marginBottom: spacing["3xl"],
  },
  planCard: {
    width: 200,
    padding: spacing["2xl"],
    backgroundColor: colors.background.tertiary,
    borderRadius: radius["2xl"],
    borderWidth: 2,
    borderColor: colors.border.secondary,
    position: "relative",
  },
  planCardSelected: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.background.brandPrimary,
    shadowColor: colors.background.brandPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  planCardFeatured: {
    borderWidth: 3,
  },
  discountTag: {
    position: "absolute",
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.background.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  discountTagText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.white,
  },
  planHeader: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  lessonCount: {
    fontSize: 56,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    lineHeight: 56,
  },
  lessonCountSelected: {
    color: colors.background.brandPrimary,
  },
  lessonLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  lessonLabelSelected: {
    color: colors.text.secondary,
  },
  priceContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  originalPrice: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    textDecorationLine: "line-through",
    marginBottom: spacing.xxs,
  },
  price: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  priceSelected: {
    color: colors.background.brandPrimary,
  },
  pricePerLesson: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  pricePerLessonSelected: {
    color: colors.text.secondary,
  },
  savingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  savingsText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.success,
    fontWeight: typography.fontWeight.semibold,
  },
  popularBadge: {
    position: "absolute",
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.brandPrimary,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    gap: spacing.xs,
  },
  popularText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.white,
    fontWeight: typography.fontWeight.semibold,
  },
  selectedCheck: {
    position: "absolute",
    top: spacing.lg,
    left: spacing.lg,
  },
  installmentSection: {
    marginBottom: spacing["3xl"],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.lg,
  },
  installmentOptions: {
    gap: spacing.md,
  },
  installmentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border.secondary,
  },
  installmentOptionSelected: {
    borderColor: colors.background.brandPrimary,
    backgroundColor: colors.background.secondary,
  },
  installmentInfo: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.md,
  },
  installmentText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  installmentTextSelected: {
    color: colors.background.brandPrimary,
  },
  installmentValue: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  installmentValueSelected: {
    color: colors.text.primary,
  },
  infoNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: spacing.md,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.md,
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.xs,
  },
  benefitsSection: {
    marginBottom: spacing["3xl"],
  },
  benefitsList: {
    gap: spacing.md,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  benefitText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
});
