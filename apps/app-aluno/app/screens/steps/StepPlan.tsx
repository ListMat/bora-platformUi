import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { trpc } from "@/lib/trpc";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface StepPlanProps {
  formData: any;
  updateFormData: (updates: any) => void;
  instructorId: string;
  onNext: () => void;
}

export default function StepPlan({
  formData,
  updateFormData,
  instructorId,
  onNext,
}: StepPlanProps) {
  const { data: plans, isLoading } = trpc.plan.list.useQuery();
  const selectedPlanId = formData.planId;

  const handleSelect = (plan: any) => {
    updateFormData({
      planId: plan.id,
      price: plan.price / plan.lessons,
    });
  };

  const renderPlan = ({ item }: { item: any }) => {
    const isSelected = selectedPlanId === item.id;
    const showInstallment = item.price >= 200;

    return (
      <TouchableOpacity
        style={[styles.planCard, isSelected && styles.planCardSelected]}
        onPress={() => handleSelect(item)}
      >
        <View style={styles.planHeader}>
          <Text style={[styles.planName, isSelected && styles.planNameSelected]}>
            {item.name}
          </Text>
          {item.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{item.discount}%</Text>
            </View>
          )}
        </View>
        <View style={styles.planPrice}>
          <Text style={[styles.priceValue, isSelected && styles.priceValueSelected]}>
            R$ {item.price.toFixed(2)}
          </Text>
          {item.lessons > 1 && (
            <Text style={styles.pricePerLesson}>
              R$ {(item.price / item.lessons).toFixed(2)}/aula
            </Text>
          )}
        </View>
        {showInstallment && (
          <View style={styles.installmentInfo}>
            <Ionicons name="card" size={16} color={colors.background.brandPrimary} />
            <Text style={styles.installmentText}>Parcelar em 3x (sem juros)</Text>
          </View>
        )}
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Ionicons name="checkmark-circle" size={24} color={colors.background.brandPrimary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.background.brandPrimary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha o plano</Text>
      <Text style={styles.subtitle}>Valor por aula ou pacote fechado</Text>

      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        renderItem={renderPlan}
        contentContainerStyle={styles.plansList}
        showsVerticalScrollIndicator={false}
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  plansList: {
    paddingBottom: spacing["2xl"],
  },
  planCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius["2xl"],
    padding: spacing["2xl"],
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: "transparent",
  },
  planCardSelected: {
    backgroundColor: colors.background.tertiary,
    borderColor: colors.background.brandPrimary,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  planName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  planNameSelected: {
    color: colors.background.brandPrimary,
  },
  discountBadge: {
    backgroundColor: "#FF6D00",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  discountText: {
    color: colors.text.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  planPrice: {
    marginBottom: spacing.sm,
  },
  priceValue: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  priceValueSelected: {
    color: colors.background.brandPrimary,
  },
  pricePerLesson: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  installmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  installmentText: {
    fontSize: typography.fontSize.xs,
    color: colors.background.brandPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  selectedIndicator: {
    position: "absolute",
    top: spacing.xl,
    right: spacing.xl,
  },
});
