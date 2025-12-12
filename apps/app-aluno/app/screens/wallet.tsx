import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";

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
  const hoursBalance = Number(walletBalance) / 100; // Assumindo R$ 100 por hora

  const handleBuyPackage = (packageData: typeof PACKAGES[0]) => {
    // Navegar para seleção de método de pagamento
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
        <Text style={styles.transactionType}>
          {item.lesson ? "Aula" : "Pacote"}
        </Text>
        <Text style={[
          styles.transactionAmount,
          item.status === "COMPLETED" ? styles.amountPositive : styles.amountPending
        ]}>
          R$ {Number(item.amount).toFixed(2)}
        </Text>
      </View>
      {item.lesson && (
        <Text style={styles.transactionInstructor}>
          Instrutor: {item.lesson.instructor.user.name}
        </Text>
      )}
      <View style={styles.transactionFooter}>
        <Text style={styles.transactionDate}>
          {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </Text>
        <Text style={[
          styles.transactionStatus,
          item.status === "COMPLETED" && styles.statusCompleted
        ]}>
          {item.status === "COMPLETED" ? "Concluído" : "Pendente"}
        </Text>
      </View>
    </View>
  );

  if (isLoadingUser) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  const allPayments = paymentsData?.pages.flatMap(page => page.payments) || [];

  return (
    <View style={styles.container}>
      {/* Wallet Balance */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Disponível</Text>
        <Text style={styles.balanceAmount}>R$ {Number(walletBalance).toFixed(2)}</Text>
        <Text style={styles.hoursBalance}>
          ≈ {hoursBalance.toFixed(1)} horas de aula
        </Text>
      </View>

      {/* Packages */}
      <Text style={styles.sectionTitle}>Pacotes com Desconto</Text>
      <FlatList
        data={PACKAGES}
        keyExtractor={(item) => item.id}
        renderItem={renderPackage}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.packagesList}
      />

      {/* Transaction History */}
      <Text style={styles.sectionTitle}>Histórico</Text>
      {isLoadingPayments ? (
        <View style={styles.placeholderSmall}>
          <ActivityIndicator size="small" color="#00C853" />
        </View>
      ) : allPayments.length === 0 ? (
        <View style={styles.placeholderSmall}>
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
    backgroundColor: "#fff",
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceCard: {
    backgroundColor: "#00C853",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  hoursBalance: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 8,
  },
  packagesList: {
    paddingBottom: 16,
  },
  packageCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 180,
    borderWidth: 2,
    borderColor: "#00C853",
  },
  packageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  packageHours: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00C853",
  },
  discountBadge: {
    backgroundColor: "#FF6D00",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  priceContainer: {
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 13,
    color: "#999",
    textDecorationLine: "line-through",
  },
  packagePrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00C853",
  },
  perHour: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
  },
  buyButton: {
    backgroundColor: "#00C853",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  transactionsList: {
    paddingBottom: 20,
  },
  transactionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#00C853",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  transactionType: {
    fontSize: 15,
    fontWeight: "600",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  amountPositive: {
    color: "#00C853",
  },
  amountPending: {
    color: "#FFA500",
  },
  transactionInstructor: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  transactionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionDate: {
    fontSize: 12,
    color: "#999",
  },
  transactionStatus: {
    fontSize: 12,
    color: "#FFA500",
    fontWeight: "600",
  },
  statusCompleted: {
    color: "#00C853",
  },
  placeholderSmall: {
    padding: 20,
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
  },
});


