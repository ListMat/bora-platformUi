import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { colors, spacing, radius, typography } from "@/theme";
import { Ionicons } from "@expo/vector-icons";

const PACKAGES = [
  { id: "5h", hours: 5, price: 450, discount: 10, originalPrice: 500 },
  { id: "10h", hours: 10, price: 850, discount: 15, originalPrice: 1000 },
  { id: "20h", hours: 20, price: 1600, discount: 20, originalPrice: 2000 },
];

export default function WalletScreen() {
  const router = useRouter();

  const { data: user, isLoading: isLoadingUser } = trpc.user.me.useQuery();
  const { data: paymentsData, isLoading: isLoadingPayments } = trpc.payment.myPayments.useInfiniteQuery(
    { limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const walletBalance = user?.student?.walletBalance || 0;
  const hoursBalance = Number(walletBalance) / 100;

  const handleBuyPackage = (packageData: typeof PACKAGES[0]) => {
    router.push({
      pathname: "/screens/paymentMethod",
      params: { 
        packageId: packageData.id,
        amount: packageData.price,
        hours: packageData.hours 
      },
    });
  };

  const renderPackage = ({ item }: any) => (
    <View style={styles.packageCard}>
      <View style={styles.packageHeader}>
        <Text style={styles.packageHours}>{item.hours}h</Text>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}% OFF</Text>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.originalPrice}>R$ {item.originalPrice.toFixed(2)}</Text>
        <Text style={styles.packagePrice}>R$ {item.price.toFixed(2)}</Text>
      </View>
      <Text style={styles.perHour}>
        R$ {(item.price / item.hours).toFixed(2)}/hora
      </Text>
      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => handleBuyPackage(item)}
      >
        <Text style={styles.buyButtonText}>Comprar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTransaction = ({ item }: any) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionTypeContainer}>
          <Ionicons 
            name={item.lesson ? "school" : "cube"} 
            size={16} 
            color={colors.text.secondary} 
          />
          <Text style={styles.transactionType}>
            {item.lesson ? "Aula" : "Pacote"}
          </Text>
        </View>
        <Text style={[
          styles.transactionAmount,
          item.status === "COMPLETED" ? styles.amountPositive : styles.amountPending
        ]}>
          R$ {Number(item.amount).toFixed(2)}
        </Text>
      </View>
      {item.lesson && (
        <Text style={styles.transactionInstructor}>
          Instrutor: {item.lesson.instructor?.user?.name || "N/A"}
        </Text>
      )}
      <View style={styles.transactionFooter}>
        <Text style={styles.transactionDate}>
          {new Date(item.createdAt).toLocaleDateString("pt-BR")}
        </Text>
        <View style={[
          styles.statusBadge,
          item.status === "COMPLETED" && styles.statusBadgeCompleted
        ]}>
          <Text style={[
            styles.transactionStatus,
            item.status === "COMPLETED" && styles.statusCompleted
          ]}>
            {item.status === "COMPLETED" ? "Concluído" : "Pendente"}
          </Text>
        </View>
      </View>
    </View>
  );

  if (isLoadingUser) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.background.brandPrimary} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  const allPayments = paymentsData?.pages.flatMap(page => page.payments) || [];

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Disponível</Text>
        <Text style={styles.balanceAmount}>R$ {Number(walletBalance).toFixed(2)}</Text>
        <Text style={styles.hoursBalance}>
          ≈ {hoursBalance.toFixed(1)} horas de aula
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Pacotes com Desconto</Text>
      <FlatList
        data={PACKAGES}
        keyExtractor={(item) => item.id}
        renderItem={renderPackage}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.packagesList}
      />

      <Text style={styles.sectionTitle}>Histórico</Text>
      {isLoadingPayments ? (
        <View style={styles.placeholderSmall}>
          <ActivityIndicator size="small" color={colors.background.brandPrimary} />
        </View>
      ) : allPayments.length === 0 ? (
        <View style={styles.placeholderSmall}>
          <Ionicons name="receipt-outline" size={48} color={colors.text.tertiary} />
          <Text style={styles.placeholderText}>Nenhuma transação ainda</Text>
        </View>
      ) : (
        <FlatList
          data={allPayments}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          contentContainerStyle={styles.transactionsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing["2xl"],
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.lg,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  balanceCard: {
    backgroundColor: colors.background.brandPrimary,
    borderRadius: radius["2xl"],
    padding: spacing["3xl"],
    marginBottom: spacing["3xl"],
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.white,
    opacity: 0.9,
    marginBottom: spacing.sm,
    fontWeight: typography.fontWeight.medium,
  },
  balanceAmount: {
    fontSize: typography.fontSize["5xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.white,
    marginBottom: spacing.xs,
  },
  hoursBalance: {
    fontSize: typography.fontSize.sm,
    color: colors.text.white,
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  packagesList: {
    paddingBottom: spacing.xl,
  },
  packageCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius["2xl"],
    padding: spacing.xl,
    marginRight: spacing.lg,
    width: 180,
    borderWidth: 2,
    borderColor: colors.background.brandPrimary,
  },
  packageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  packageHours: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.background.brandPrimary,
  },
  discountBadge: {
    backgroundColor: "#FF6D00",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
  },
  discountText: {
    color: colors.text.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  priceContainer: {
    marginBottom: spacing.sm,
  },
  originalPrice: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    textDecorationLine: "line-through",
  },
  packagePrice: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.background.brandPrimary,
  },
  perHour: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  buyButton: {
    backgroundColor: colors.background.brandPrimary,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  buyButtonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  transactionsList: {
    paddingBottom: spacing["2xl"],
  },
  transactionCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.background.brandPrimary,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  transactionTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  transactionType: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  transactionAmount: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  amountPositive: {
    color: colors.background.brandPrimary,
  },
  amountPending: {
    color: colors.text.warning,
  },
  transactionInstructor: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  transactionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionDate: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  statusBadge: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  statusBadgeCompleted: {
    backgroundColor: colors.background.brandPrimary,
  },
  transactionStatus: {
    fontSize: typography.fontSize.xs,
    color: colors.text.warning,
    fontWeight: typography.fontWeight.semibold,
  },
  statusCompleted: {
    color: colors.text.white,
  },
  placeholderSmall: {
    padding: spacing["2xl"],
    alignItems: "center",
  },
  placeholderText: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    marginTop: spacing.lg,
    textAlign: "center",
  },
});
