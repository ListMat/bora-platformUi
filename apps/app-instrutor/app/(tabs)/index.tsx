import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { Ionicons } from "@expo/vector-icons";
import AcceptLessonModal from "../screens/AcceptLessonModal";
import { useLocationTracking } from "../../hooks/useLocationTracking";
import { useNotifications } from "../../hooks/useNotifications";
import { colors, spacing, radius, typography } from "@/theme";

export default function HomeScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  // Notificações push
  useNotifications();

  // Rastreamento de localização quando online
  useLocationTracking({ enabled: isOnline, interval: 30000 }); // Atualizar a cada 30 segundos

  // Buscar dados do instrutor
  const { data: instructor, isLoading: isLoadingInstructor } = trpc.instructor.getMyProfile.useQuery();
  const { data: nextLessons, isLoading: isLoadingLessons } = trpc.lesson.myUpcoming.useQuery();
  const { data: monthlyEarnings } = trpc.instructor.monthlyEarnings.useQuery();

  // Buscar veículo principal
  const { data: vehicles } = trpc.vehicle.myVehicles.useQuery();
  const mainVehicle = vehicles?.[0];

  // Toggle online/offline
  const updateAvailabilityMutation = trpc.instructor.updateAvailability.useMutation({
    onSuccess: () => {
      // Localização será atualizada automaticamente pelo hook useLocationTracking
    },
  });

  const handleToggleOnline = (value: boolean) => {
    setIsOnline(value);
    updateAvailabilityMutation.mutate({ isAvailable: value });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const renderLessonCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.lessonCard}
      onPress={() => router.push(`/screens/lessonChat?lessonId=${item.id}`)}
    >
      <View style={styles.lessonHeader}>
        <Text style={styles.lessonTime}>
          {new Date(item.scheduledAt).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <View style={styles.lessonStatusBadge}>
          <Text style={styles.lessonStatusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.lessonStudent}>{item.student?.user?.name || "Aluno"}</Text>
      <Text style={styles.lessonType}>{item.lessonType || "1ª Habilitação"}</Text>
    </TouchableOpacity>
  );

  if (isLoadingInstructor) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.background.brandPrimary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Header com toggle Online */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerUserInfo}>
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
                  <Ionicons name="checkmark-circle" size={16} color={colors.background.brandPrimary} />
                </View>
              )}
            </View>
            <View>
              <Text style={styles.greeting}>Olá, {instructor?.user?.name || "Instrutor"}!</Text>
              <View style={styles.onlineStatus}>
                <View style={[styles.statusDot, isOnline && styles.statusDotOnline]} />
                <Text style={styles.onlineText}>{isOnline ? "Online" : "Offline"}</Text>
              </View>
            </View>
          </View>
          <Switch
            value={isOnline}
            onValueChange={handleToggleOnline}
            trackColor={{ false: colors.border.secondary, true: colors.background.brandPrimary }}
            thumbColor={colors.text.white}
          />
        </View>

        {/* Preço e Rating */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="cash" size={20} color={colors.background.brandPrimary} />
            <Text style={styles.statValue}>
              {formatCurrency(Number(instructor?.basePrice || 0))}/hora
            </Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.statValue}>
              {instructor?.averageRating?.toFixed(1) || "0.0"} ({instructor?.totalLessons || 0})
            </Text>
          </View>
        </View>

        {/* Carro Principal */}
        {mainVehicle && (
          <View style={styles.vehicleCard}>
            <Image
              source={{ uri: mainVehicle.photoUrl }}
              style={styles.vehicleImage}
            />
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleModel}>
                {mainVehicle.brand} {mainVehicle.model}
              </Text>
              <Text style={styles.vehicleDetails}>
                {mainVehicle.transmission === "AUTOMATICO" ? "Automático" : "Manual"}
                {mainVehicle.acceptStudentCar && " • Aceita carro do aluno"}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Botão Aceitar Aulas */}
      <TouchableOpacity
        style={[styles.acceptButton, (!isOnline || !vehicles || vehicles.length === 0) && styles.acceptButtonDisabled]}
        onPress={() => {
          if (!vehicles || vehicles.length === 0) {
            Alert.alert(
              "Veículo necessário",
              "Você precisa cadastrar pelo menos um veículo antes de aceitar aulas.",
              [
                { text: "Cancelar", style: "cancel" },
                { text: "Cadastrar Veículo", onPress: () => router.push("/screens/vehicles") },
              ]
            );
            return;
          }
          setShowAcceptModal(true);
        }}
        disabled={!isOnline || !vehicles || vehicles.length === 0}
      >
        <Ionicons
          name={isOnline ? "checkmark-circle" : "pause-circle"}
          size={24}
          color="#fff"
        />
        <Text style={styles.acceptButtonText}>
          {isOnline ? "ACEITAR AULAS" : "Pausar"}
        </Text>
      </TouchableOpacity>

      {/* Próximas Aulas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximas Aulas</Text>
        {isLoadingLessons ? (
          <ActivityIndicator size="small" color={colors.background.brandPrimary} />
        ) : nextLessons && nextLessons.length > 0 ? (
          <FlatList
            data={nextLessons}
            keyExtractor={(item) => item.id}
            renderItem={renderLessonCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.lessonsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyText}>Nenhuma aula agendada</Text>
          </View>
        )}
      </View>

      {/* Ganhos do Mês */}
      <View style={styles.earningsCard}>
        <Ionicons name="trending-up" size={24} color={colors.background.brandPrimary} />
        <View style={styles.earningsInfo}>
          <Text style={styles.earningsLabel}>R$ {monthlyEarnings?.toFixed(2) || "0.00"} este mês</Text>
          <Text style={styles.earningsSubtext}>Continue assim! 🚀</Text>
        </View>
      </View>

      {/* Shortcuts */}
      <View style={styles.shortcuts}>
        <TouchableOpacity
          style={styles.shortcutButton}
          onPress={() => router.push("/screens/lessonChat")}
        >
          <Ionicons name="chatbubbles" size={24} color={colors.background.brandPrimary} />
          <Text style={styles.shortcutText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shortcutButton}
          onPress={() => router.push("/screens/packages")}
        >
          <Ionicons name="pricetags" size={24} color={colors.background.brandPrimary} />
          <Text style={styles.shortcutText}>Pacotes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shortcutButton}
          onPress={() => router.push("/screens/schedule")}
        >
          <Ionicons name="calendar" size={24} color={colors.background.brandPrimary} />
          <Text style={styles.shortcutText}>Agenda</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Aceitar Aulas */}
      <AcceptLessonModal
        visible={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        vehicle={mainVehicle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing['2xl'],
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: spacing['3xl'],
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  headerUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.background.tertiary,
  },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  avatarInitial: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: colors.background.primary,
    borderRadius: radius.full,
    padding: 1,
  },
  greeting: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  onlineStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  statusDot: {
    width: spacing.md,
    height: spacing.md,
    borderRadius: radius.xs,
    backgroundColor: colors.text.disabled,
  },
  statusDotOnline: {
    backgroundColor: colors.background.success,
  },
  onlineText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.background.tertiary,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  statValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  vehicleCard: {
    flexDirection: "row",
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  vehicleImage: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.background.quaternary,
  },
  vehicleInfo: {
    flex: 1,
    justifyContent: "center",
  },
  vehicleModel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  vehicleDetails: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  acceptButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.brandPrimary,
    padding: spacing.xl,
    borderRadius: radius.lg,
    gap: spacing.md,
    marginBottom: spacing['3xl'],
  },
  acceptButtonDisabled: {
    backgroundColor: colors.background.disabled,
  },
  acceptButtonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  section: {
    marginBottom: spacing['3xl'],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  lessonsList: {
    paddingRight: spacing['2xl'],
  },
  lessonCard: {
    width: 200,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginRight: spacing.lg,
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  lessonTime: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  lessonStatusBadge: {
    backgroundColor: colors.background.brandPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.xs,
  },
  lessonStatusText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.white,
    fontWeight: typography.fontWeight.semibold,
  },
  lessonStudent: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  lessonType: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  emptyState: {
    alignItems: "center",
    padding: spacing['5xl'],
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    marginTop: spacing.lg,
  },
  earningsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    padding: spacing.xl,
    borderRadius: radius.lg,
    gap: spacing.lg,
    marginBottom: spacing['3xl'],
    borderWidth: 1,
    borderColor: colors.border.brand,
  },
  earningsInfo: {
    flex: 1,
  },
  earningsLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background.brandPrimary,
    marginBottom: spacing.xs,
  },
  earningsSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  shortcuts: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  shortcutButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.tertiary,
    padding: spacing.xl,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  shortcutText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
});
