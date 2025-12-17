import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

export default function VehiclesScreen() {
  const router = useRouter();
  const { data: vehicles, isLoading, refetch } = trpc.vehicle.myVehicles.useQuery();

  const canAddVehicle = !vehicles || vehicles.length < 3;

  const renderVehicle = ({ item }: { item: any }) => {
    const getTransmissionLabel = (transmission: string) => {
      switch (transmission) {
        case "MANUAL":
          return "Manual";
        case "AUTOMATICO":
          return "Automático";
        case "CVT":
          return "CVT";
        case "SEMI_AUTOMATICO":
          return "Semi-automático";
        default:
          return transmission;
      }
    };

    const getCategoryLabel = (category: string) => {
      switch (category) {
        case "MOTO":
          return "Moto";
        case "HATCH":
          return "Hatch";
        case "SEDAN":
          return "Sedan";
        case "SUV":
          return "SUV";
        case "PICKUP":
          return "Pick-up";
        case "SPORTIVO":
          return "Sportivo";
        case "COMPACTO":
          return "Compacto";
        case "ELETRICO":
          return "Elétrico";
        default:
          return category;
      }
    };

    return (
      <View style={styles.vehicleCard}>
        {item.photoUrl ? (
          <Image source={{ uri: item.photoUrl }} style={styles.vehicleImage} />
        ) : (
          <View style={[styles.vehicleImage, styles.vehicleImagePlaceholder]}>
            <Ionicons name="car" size={48} color={colors.text.tertiary} />
          </View>
        )}
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleTitle}>
            {item.brand} {item.model}
          </Text>
          <Text style={styles.vehicleSubtitle}>
            {getCategoryLabel(item.category)} · {getTransmissionLabel(item.transmission)}
          </Text>
          {item.hasDualPedal && (
            <View style={styles.badge}>
              <Ionicons name="checkmark-circle" size={16} color={colors.background.brandPrimary} />
              <Text style={styles.badgeText}>Duplo-pedal</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push(`/screens/editVehicle?id=${item.id}`)}
        >
          <Ionicons name="pencil" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meus Veículos</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.background.brandPrimary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Veículos</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {vehicles && vehicles.length > 0 ? (
          <>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color={colors.background.brandPrimary} />
              <Text style={styles.infoText}>
                Você pode cadastrar até 3 veículos. {vehicles.length}/3 cadastrados.
              </Text>
            </View>

            <FlatList
              data={vehicles}
              keyExtractor={(item) => item.id}
              renderItem={renderVehicle}
              contentContainerStyle={styles.list}
              ListFooterComponent={
                canAddVehicle ? (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push("/screens/addVehicle")}
                  >
                    <Ionicons name="add-circle" size={24} color={colors.background.brandPrimary} />
                    <Text style={styles.addButtonText}>Adicionar Veículo</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.maxVehiclesCard}>
                    <Ionicons name="checkmark-circle" size={24} color={colors.background.brandPrimary} />
                    <Text style={styles.maxVehiclesText}>
                      Limite de 3 veículos atingido
                    </Text>
                  </View>
                )
              }
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={64} color={colors.text.tertiary} />
            <Text style={styles.emptyTitle}>Nenhum veículo cadastrado</Text>
            <Text style={styles.emptySubtitle}>
              Cadastre seu primeiro veículo para começar a aceitar aulas
            </Text>
            {canAddVehicle && (
              <TouchableOpacity
                style={styles.addButtonPrimary}
                onPress={() => router.push("/screens/addVehicle")}
              >
                <Ionicons name="add-circle" size={24} color={colors.text.white} />
                <Text style={styles.addButtonPrimaryText}>Cadastrar Veículo</Text>
              </TouchableOpacity>
            )}
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
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    padding: spacing['2xl'],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: radius.md,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  list: {
    paddingBottom: spacing['2xl'],
  },
  vehicleCard: {
    flexDirection: "row",
    backgroundColor: colors.background.secondary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: "center",
  },
  vehicleImage: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: colors.background.tertiary,
  },
  vehicleImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  vehicleTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  vehicleSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.background.brandPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  editButton: {
    padding: spacing.md,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.background.secondary,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border.brand,
    borderStyle: "dashed",
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  addButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background.brandPrimary,
  },
  addButtonPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.background.brandPrimary,
    borderRadius: radius.lg,
    marginTop: spacing['2xl'],
    gap: spacing.md,
  },
  addButtonPrimaryText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.white,
  },
  maxVehiclesCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.background.secondary,
    borderRadius: radius.lg,
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  maxVehiclesText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing['5xl'],
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing['2xl'],
  },
});

