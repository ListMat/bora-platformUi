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
import { useState } from "react";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface StepVehicleProps {
  formData: any;
  updateFormData: (updates: any) => void;
  instructorId: string;
  onNext: () => void;
}

export default function StepVehicle({
  formData,
  updateFormData,
  instructorId,
  onNext,
}: StepVehicleProps) {
  const router = useRouter();
  const [useOwnVehicle, setUseOwnVehicle] = useState(formData.useOwnVehicle);

  const { data: instructorVehicles, isLoading: isLoadingInstructor } =
    trpc.instructor.vehicles.useQuery(
      { instructorId },
      { enabled: !!instructorId }
    );

  const { data: myVehicles, isLoading: isLoadingMine } =
    trpc.vehicle.myVehicles.useQuery();

  const handleSelectInstructorVehicle = (vehicleId: string) => {
    setUseOwnVehicle(false);
    updateFormData({ vehicleId, useOwnVehicle: false });
  };

  const handleSelectOwnVehicle = (vehicleId: string) => {
    setUseOwnVehicle(true);
    updateFormData({ vehicleId, useOwnVehicle: true });
  };

  const handleAddVehicle = () => {
    Alert.alert(
      "Cadastrar Veículo",
      "Redirecione para a tela de cadastro de veículos",
      [{ text: "OK" }]
    );
  };

  const renderInstructorVehicle = ({ item }: { item: any }) => {
    const isSelected = !useOwnVehicle && formData.vehicleId === item.id;
    return (
      <TouchableOpacity
        style={[styles.vehicleCard, isSelected && styles.vehicleCardSelected]}
        onPress={() => handleSelectInstructorVehicle(item.id)}
      >
        {item.photoUrl ? (
          <Image
            source={{ uri: item.photoUrl }}
            style={styles.vehicleImage}
          />
        ) : (
          <View style={styles.vehicleImagePlaceholder}>
            <Ionicons name="car" size={32} color={colors.text.tertiary} />
          </View>
        )}
        <View style={styles.vehicleInfo}>
          <Text style={[styles.vehicleModel, isSelected && styles.vehicleModelSelected]}>
            {item.brand} {item.model}
          </Text>
          <Text style={styles.vehicleDetails}>
            {item.transmission === "AUTOMATICO" ? "Automático" : "Manual"}
            {item.hasDualPedal && " • Duplo-pedal"}
          </Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={colors.background.brandPrimary} />
        )}
      </TouchableOpacity>
    );
  };

  const renderMyVehicle = ({ item }: { item: any }) => {
    const isSelected = useOwnVehicle && formData.vehicleId === item.id;
    return (
      <TouchableOpacity
        style={[styles.vehicleCard, isSelected && styles.vehicleCardSelected]}
        onPress={() => handleSelectOwnVehicle(item.id)}
      >
        {item.photoUrl ? (
          <Image
            source={{ uri: item.photoUrl }}
            style={styles.vehicleImage}
          />
        ) : (
          <View style={styles.vehicleImagePlaceholder}>
            <Ionicons name="car" size={32} color={colors.text.tertiary} />
          </View>
        )}
        <View style={styles.vehicleInfo}>
          <View style={styles.vehicleHeader}>
            <Text style={[styles.vehicleModel, isSelected && styles.vehicleModelSelected]}>
              {item.brand} {item.model}
            </Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-15%</Text>
            </View>
          </View>
          <Text style={styles.vehicleDetails}>
            {item.transmission === "AUTOMATICO" ? "Automático" : "Manual"}
          </Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={colors.background.brandPrimary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha o veículo</Text>
      <Text style={styles.subtitle}>Carro da autoescola ou seu próprio carro</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Carro da Autoescola</Text>
        {isLoadingInstructor ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.background.brandPrimary} />
          </View>
        ) : !instructorVehicles || instructorVehicles.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum veículo disponível</Text>
          </View>
        ) : (
          <FlatList
            data={instructorVehicles}
            keyExtractor={(item) => item.id}
            renderItem={renderInstructorVehicle}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vehiclesList}
          />
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Meu Carro</Text>
          <View style={styles.discountTag}>
            <Text style={styles.discountTagText}>Economia 15%</Text>
          </View>
        </View>
        {isLoadingMine ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.background.brandPrimary} />
          </View>
        ) : !myVehicles || myVehicles.length === 0 ? (
          <TouchableOpacity style={styles.addVehicleButton} onPress={handleAddVehicle}>
            <Ionicons name="add-circle-outline" size={24} color={colors.background.brandPrimary} />
            <Text style={styles.addVehicleText}>Cadastrar meu carro</Text>
          </TouchableOpacity>
        ) : (
          <FlatList
            data={myVehicles}
            keyExtractor={(item) => item.id}
            renderItem={renderMyVehicle}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vehiclesList}
          />
        )}
      </View>
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
  section: {
    marginBottom: spacing["4xl"],
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  discountTag: {
    backgroundColor: "#FF6D00",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  discountTagText: {
    color: colors.text.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  vehiclesList: {
    paddingRight: spacing["2xl"],
  },
  vehicleCard: {
    width: 200,
    borderRadius: radius["2xl"],
    backgroundColor: colors.background.secondary,
    marginRight: spacing.lg,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  vehicleCardSelected: {
    borderColor: colors.background.brandPrimary,
    backgroundColor: colors.background.tertiary,
  },
  vehicleImage: {
    width: "100%",
    height: 120,
    backgroundColor: colors.background.quaternary,
  },
  vehicleImagePlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: colors.background.quaternary,
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleInfo: {
    padding: spacing.lg,
  },
  vehicleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  vehicleModel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    flex: 1,
  },
  vehicleModelSelected: {
    color: colors.background.brandPrimary,
  },
  discountBadge: {
    backgroundColor: "#FF6D00",
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  discountText: {
    color: colors.text.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  vehicleDetails: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  loadingContainer: {
    padding: spacing["5xl"],
    alignItems: "center",
  },
  emptyState: {
    padding: spacing["5xl"],
    alignItems: "center",
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    textAlign: "center",
  },
  addVehicleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing["2xl"],
    borderWidth: 2,
    borderColor: colors.background.brandPrimary,
    borderStyle: "dashed",
    borderRadius: radius["2xl"],
    gap: spacing.sm,
  },
  addVehicleText: {
    fontSize: typography.fontSize.base,
    color: colors.background.brandPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
});
