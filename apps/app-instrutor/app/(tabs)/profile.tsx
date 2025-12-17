import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { trpc } from "@/lib/trpc";
import { colors, spacing, radius, typography } from "@/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const { data: instructor } = trpc.instructor.getMyProfile.useQuery();
  const { data: vehicles } = trpc.vehicle.myVehicles.useQuery();
  const vehicleCount = vehicles?.length || 0;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {instructor?.user?.image ? (
            <Image
              source={{ uri: instructor.user.image }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {instructor?.user?.name?.charAt(0) || "I"}
              </Text>
            </View>
          )}
          {instructor?.status === "ACTIVE" && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={24} color={colors.background.brandPrimary} />
            </View>
          )}
        </View>
        <Text style={styles.name}>{instructor?.user?.name || "Instrutor BORA"}</Text>
        <Text style={styles.email}>{instructor?.user?.email}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.card}>
          <Text style={styles.label}>CNH</Text>
          <Text style={styles.value}>{instructor?.cnhNumber || "Não informado"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Credencial</Text>
          <Text style={styles.value}>{instructor?.credentialNumber || "Não informado"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Preço Base</Text>
          <Text style={styles.value}>
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(instructor?.basePrice || 0))}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.vehiclesButton]}
        onPress={() => router.push("/screens/vehicles")}
      >
        <Ionicons name="car" size={20} color={colors.text.white} />
        <Text style={styles.buttonText}>Meus Veículos ({vehicleCount}/3)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.documentsButton]}>
        <Text style={styles.buttonText}>Enviar Documentos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
      
      <View style={{ height: spacing['4xl'] }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing['2xl'],
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xl,
    color: colors.text.primary,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing['3xl'],
  },
  avatarContainer: {
    position: "relative",
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: colors.background.tertiary,
  },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.border.secondary,
  },
  avatarInitial: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.background.primary,
    borderRadius: radius.full,
    padding: 2,
  },
  name: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.background.tertiary,
    padding: spacing.xl,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  button: {
    backgroundColor: colors.background.brandPrimary,
    padding: spacing.xl,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing.xl,
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
  },
  vehiclesButton: {
    backgroundColor: colors.background.success,
  },
  buttonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  documentsButton: {
    backgroundColor: colors.background.success,
  },
  logoutButton: {
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  logoutText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});

