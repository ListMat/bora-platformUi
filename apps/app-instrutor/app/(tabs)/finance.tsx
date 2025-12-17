import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, spacing, radius, typography } from "@/theme";

export default function FinanceScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { data: balance, isLoading: isLoadingBalance } = trpc.instructor.balance.useQuery();
  const { data: transactions, isLoading: isLoadingTransactions } =
    trpc.instructor.transactions.useQuery();

  const onRefresh = async () => {
    setRefreshing(true);
    // Refetch queries
    await Promise.all([
      trpc.instructor.balance.useQuery().refetch(),
      trpc.instructor.transactions.useQuery().refetch(),
    ]);
    setRefreshing(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderTransaction = ({ item }: { item: any }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionInfo}>
          <Ionicons
            name={item.type === "CREDIT" ? "arrow-down-circle" : "arrow-up-circle"}
            size={24}
            color={item.type === "CREDIT" ? colors.background.success : colors.background.brandPrimary}
          />
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>{item.description}</Text>
            <Text style={styles.transactionDate}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.transactionAmount,
            item.type === "CREDIT" ? styles.creditAmount : styles.debitAmount,
          ]}
        >
          {item.type === "CREDIT" ? "+" : "-"}
          {formatCurrency(Math.abs(Number(item.amount)))}
        </Text>
      </View>
      {item.status === "PENDING" && (
        <View style={styles.pendingBadge}>
          <Text style={styles.pendingText}>Pendente</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Disponível</Text>
        {isLoadingBalance ? (
          <ActivityIndicator size="small" color={colors.background.brandPrimary} />
        ) : (
          <Text style={styles.balanceValue}>
            {formatCurrency(Number(balance?.available || 0))}
          </Text>
        )}
        <Text style={styles.balanceSubtext}>
          Disponível para saque em D+1
        </Text>
      </View>

      {/* Withdraw Button */}
      <TouchableOpacity
        style={styles.withdrawButton}
        onPress={() => router.push("/screens/withdrawPix")}
      >
        <Ionicons name="cash-outline" size={24} color="#fff" />
        <Text style={styles.withdrawButtonText}>Solicitar Saque Pix</Text>
      </TouchableOpacity>

      {/* Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Extrato</Text>
        {isLoadingTransactions ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.background.brandPrimary} />
          </View>
        ) : transactions && transactions.length > 0 ? (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={renderTransaction}
            contentContainerStyle={styles.transactionsList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyText}>Nenhuma transação ainda</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing['2xl'],
  },
  balanceCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius['2xl'],
    padding: spacing['3xl'],
    marginBottom: spacing['2xl'],
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.brand,
  },
  balanceLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  balanceValue: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.background.brandPrimary,
    marginBottom: spacing.md,
  },
  balanceSubtext: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  withdrawButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.brandPrimary,
    padding: spacing.xl,
    borderRadius: radius.lg,
    gap: spacing.md,
    marginBottom: spacing['3xl'],
  },
  withdrawButtonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionsList: {
    paddingBottom: spacing['2xl'],
  },
  transactionCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    flex: 1,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  transactionDate: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  transactionAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  creditAmount: {
    color: colors.background.success,
  },
  debitAmount: {
    color: colors.background.brandPrimary,
  },
  pendingBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.xs,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.brand,
  },
  pendingText: {
    fontSize: typography.fontSize.xs,
    color: colors.background.brandPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing['5xl'],
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    marginTop: spacing.lg,
  },
});
