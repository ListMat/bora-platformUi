import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";
import { trpc } from "@/lib/trpc";
import { useRouter } from "expo-router";

interface StepVehicleProps {
  formData: {
    vehicleId: string | null;
    useOwnVehicle: boolean;
  };
  updateFormData: (data: any) => void;
  instructorId: string;
  onNext: () => void;
}

export default function StepVehicle({ formData, updateFormData, instructorId, onNext }: StepVehicleProps) {
  const router = useRouter();

  // Fetch instructor's vehicles
  const { data: vehiclesData, isLoading } = trpc.instructor.vehicles.useQuery(
    { instructorId },
    { enabled: !!instructorId }
  );

  // Check if student has registered vehicle
  const { data: studentVehicle } = trpc.student.getVehicle.useQuery();

  const handleSelectVehicle = (vehicleId: string) => {
    updateFormData({ vehicleId, useOwnVehicle: false });
  };

  const handleUseOwnVehicle = () => {
    if (studentVehicle) {
      updateFormData({ vehicleId: null, useOwnVehicle: true });
    } else {
      // Navigate to add vehicle screen
      router.push("/register/vehicle");
    }
  };

  const vehicles = vehiclesData?.vehicles || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Veículo</Text>
      <Text style={styles.subtitle}>Escolha o carro para sua aula</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.background.brandPrimary} />
      ) : (
        <>
          {/* Auto School Vehicles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Carro da Autoescola</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.vehiclesScroll}
            >
              {vehicles.map((vehicle) => {
                const isSelected = formData.vehicleId === vehicle.id && !formData.useOwnVehicle;

                return (
                  <TouchableOpacity
                    key={vehicle.id}
                    style={[
                      styles.vehicleCard,
                      isSelected && styles.vehicleCardSelected,
                    ]}
                    onPress={() => handleSelectVehicle(vehicle.id)}
                  >
                    {/* Vehicle Image */}
                    {vehicle.photo ? (
                      <Image
                        source={{ uri: vehicle.photo }}
                        style={styles.vehicleImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.vehicleImage, styles.vehicleImagePlaceholder]}>
                        <Ionicons name="car-sport" size={48} color={colors.text.tertiary} />
                      </View>
                    )}

                    {/* Vehicle Info */}
                    <View style={styles.vehicleInfo}>
                      <Text style={[styles.vehicleModel, isSelected && styles.vehicleModelSelected]}>
                        {vehicle.model}
                      </Text>

                      <View style={styles.vehicleDetails}>
                        <View style={styles.detailBadge}>
                          <Ionicons
                            name={vehicle.transmission === "MANUAL" ? "settings-outline" : "flash-outline"}
                            size={14}
                            color={colors.text.tertiary}
                          />
                          <Text style={styles.detailText}>
                            {vehicle.transmission === "MANUAL" ? "Manual" : "Automático"}
                          </Text>
                        </View>

                        {vehicle.hasDualPedal && (
                          <View style={[styles.detailBadge, styles.dualPedalBadge]}>
                            <Ionicons name="shield-checkmark" size={14} color={colors.text.white} />
                            <Text style={styles.dualPedalText}>Duplo-pedal</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {isSelected && (
                      <View style={styles.selectedCheck}>
                        <Ionicons name="checkmark-circle" size={28} color={colors.background.brandPrimary} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Own Vehicle Option */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ou use seu carro</Text>

            <TouchableOpacity
              style={[
                styles.ownVehicleCard,
                formData.useOwnVehicle && styles.ownVehicleCardSelected,
              ]}
              onPress={handleUseOwnVehicle}
            >
              <View style={styles.ownVehicleIcon}>
                <Ionicons
                  name="car-outline"
                  size={32}
                  color={formData.useOwnVehicle ? colors.background.brandPrimary : colors.text.secondary}
                />
              </View>

              <View style={styles.ownVehicleInfo}>
                <Text style={[styles.ownVehicleTitle, formData.useOwnVehicle && styles.ownVehicleTitleSelected]}>
                  {studentVehicle ? "Usar meu carro" : "Cadastrar meu carro"}
                </Text>
                <Text style={styles.ownVehicleSubtitle}>
                  {studentVehicle
                    ? `${studentVehicle.model} • Economia 15%`
                    : "Cadastre e economize 15% na aula"}
                </Text>
              </View>

              <View style={styles.ownVehicleAction}>
                {formData.useOwnVehicle ? (
                  <Ionicons name="checkmark-circle" size={24} color={colors.background.brandPrimary} />
                ) : (
                  <>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>-15%</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
                  </>
                )}
              </View>
            </TouchableOpacity>
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
  section: {
    marginBottom: spacing["3xl"],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  vehiclesScroll: {
    gap: spacing.lg,
    paddingRight: spacing.xl,
  },
  vehicleCard: {
    width: 260,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius["2xl"],
    borderWidth: 2,
    borderColor: colors.border.secondary,
    overflow: "hidden",
    position: "relative",
  },
  vehicleCardSelected: {
    borderColor: colors.background.brandPrimary,
    shadowColor: colors.background.brandPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  vehicleImage: {
    width: "100%",
    height: 140,
    backgroundColor: colors.background.quaternary,
  },
  vehicleImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleInfo: {
    padding: spacing.lg,
  },
  vehicleModel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  vehicleModelSelected: {
    color: colors.text.primary,
  },
  vehicleDetails: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  detailBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.quaternary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    gap: spacing.xxs,
  },
  detailText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeight.medium,
  },
  dualPedalBadge: {
    backgroundColor: colors.background.brandPrimary,
  },
  dualPedalText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.white,
    fontWeight: typography.fontWeight.semibold,
  },
  selectedCheck: {
    position: "absolute",
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: radius.full,
  },
  ownVehicleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius["2xl"],
    borderWidth: 2,
    borderColor: colors.border.secondary,
    gap: spacing.lg,
  },
  ownVehicleCardSelected: {
    borderColor: colors.background.brandPrimary,
    backgroundColor: colors.background.secondary,
  },
  ownVehicleIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: colors.background.quaternary,
    justifyContent: "center",
    alignItems: "center",
  },
  ownVehicleInfo: {
    flex: 1,
  },
  ownVehicleTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  ownVehicleTitleSelected: {
    color: colors.text.primary,
  },
  ownVehicleSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  ownVehicleAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  discountBadge: {
    backgroundColor: colors.background.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  discountText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.white,
  },
});
