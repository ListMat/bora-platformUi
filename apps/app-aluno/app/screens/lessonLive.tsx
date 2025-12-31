import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
// TODO: Descomentar quando adicionar react-native-maps de volta
// import MapView, { Marker } from "react-native-maps";
// import { MAP_PROVIDER } from "@/lib/maps";
import { colors, radius, spacing, typography } from "@/theme";
import { useHaptic } from "@/hooks/useHaptic";

export default function LessonLiveScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const haptic = useHaptic();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const { data: lesson, isLoading, refetch } = trpc.lesson.getById.useQuery(
    { lessonId: id },
    { refetchInterval: 5000 } // Atualizar a cada 5 segundos
  );

  const cancelMutation = trpc.lesson.cancel.useMutation({
    onSuccess: () => {
      Alert.alert("Sucesso", "Aula cancelada");
      router.back();
    },
    onError: (error) => {
      Alert.alert("Erro", error.message);
    },
  });

  const sosMutation = trpc.emergency.create.useMutation({
    onSuccess: (data) => {
      Alert.alert(
        "SOS Ativado",
        data.message,
        [{ text: "OK" }]
      );
    },
    onError: (error) => {
      Alert.alert("Erro", error.message || "Não foi possível enviar o SOS");
    },
  });

  // Pegar localização do aluno
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erro", "Permissão de localização necessária");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  if (isLoading || !lesson) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.background.brandPrimary} />
      </View>
    );
  }

  const instructorLocation = lesson.currentLatitude && lesson.currentLongitude
    ? { latitude: lesson.currentLatitude, longitude: lesson.currentLongitude }
    : null;

  const getStatusMessage = () => {
    switch (lesson.status) {
      case "SCHEDULED":
        return "Aguardando instrutor...";
      case "ACTIVE":
        return "Aula em andamento";
      case "FINISHED":
        return "Aula finalizada";
      case "CANCELLED":
        return "Aula cancelada";
      default:
        return lesson.status;
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancelar Aula",
      "Tem certeza que deseja cancelar esta aula?",
      [
        { text: "Não", style: "cancel" },
        { text: "Sim", style: "destructive", onPress: () => { haptic.warning(); cancelMutation.mutate({ lessonId: id }); } },
      ]
    );
  };

  const handleSOS = async () => {
    if (!userLocation) {
      Alert.alert("Erro", "Não foi possível obter sua localização");
      return;
    }

    Alert.alert(
      "🚨 EMERGÊNCIA",
      "Você está acionando o botão de emergência. Isso notificará imediatamente nossa equipe e as autoridades. Deseja continuar?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "ACIONAR SOS",
          style: "destructive",
          onPress: () => {
            haptic.heavy();
            sosMutation.mutate({
              lessonId: id,
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              description: `Emergência durante aula com instrutor ${lesson?.instructor.user.name}`,
            });
          },
        },
      ]
    );
  };

  const centerLocation = userLocation || instructorLocation ||
    (lesson.pickupLatitude && lesson.pickupLongitude
      ? { latitude: lesson.pickupLatitude, longitude: lesson.pickupLongitude }
      : null);

  return (
    <View style={styles.container}>
      {/* Mapa */}
      {/* TODO: Descomentar quando adicionar react-native-maps de volta */}
      {centerLocation && (
        <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.primary }]}>
          <Text style={{ color: colors.text.secondary, textAlign: 'center', padding: 20 }}>
            Mapa temporariamente desabilitado{'\n'}
            Aula em andamento
          </Text>
        </View>
      )}
      {/*
      {centerLocation && (
        <MapView
          style={styles.map}
          provider={MAP_PROVIDER}
          initialRegion={{
            latitude: centerLocation.latitude,
            longitude: centerLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={false}
          showsMyLocationButton={false}
          toolbarEnabled={false}
        >
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              identifier="user-location"
            >
              <View style={styles.userMarker}>
                <View style={styles.userMarkerDot} />
              </View>
            </Marker>
          )}

          {instructorLocation && (
            <Marker
              coordinate={{
                latitude: instructorLocation.latitude,
                longitude: instructorLocation.longitude,
              }}
              identifier="instructor-location"
            >
              <View style={styles.instructorMarker}>
                <Ionicons name="person" size={20} color={colors.text.white} />
              </View>
            </Marker>
          )}

          {lesson.pickupLatitude && lesson.pickupLongitude && (
            <Marker
              coordinate={{
                latitude: lesson.pickupLatitude,
                longitude: lesson.pickupLongitude,
              }}
              identifier="pickup-location"
            >
              <View style={styles.pickupMarker}>
                <Ionicons name="location" size={20} color={colors.text.white} />
              </View>
            </Marker>
          )}
        </MapView>
      )}
      */}

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.header}>
          <Text style={styles.statusText}>{getStatusMessage()}</Text>
          {(lesson.status === "ACTIVE" || lesson.status === "SCHEDULED") && (
            <TouchableOpacity
              onPress={handleSOS}
              style={styles.sosButton}
              disabled={sosMutation.isLoading}
            >
              {sosMutation.isLoading ? (
                <ActivityIndicator size="small" color={colors.text.white} />
              ) : (
                <>
                  <Ionicons name="warning" size={16} color={colors.text.white} />
                  <Text style={styles.sosText}>SOS</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.instructorInfo}>
          <Text style={styles.instructorName}>{lesson.instructor.user.name}</Text>
          <Text style={styles.rating}>⭐ {lesson.instructor.averageRating.toFixed(1)}</Text>
        </View>

        <Text style={styles.address}>{lesson.pickupAddress}</Text>
        <Text style={styles.time}>
          {new Date(lesson.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </Text>

        {lesson.status === "SCHEDULED" && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar Aula</Text>
          </TouchableOpacity>
        )}

        {lesson.status === "FINISHED" && (
          <TouchableOpacity
            style={styles.rateButton}
            onPress={() => router.push(`/screens/rating?lessonId=${id}`)}
          >
            <Text style={styles.rateButtonText}>Avaliar Aula</Text>
          </TouchableOpacity>
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: radius["3xl"],
    borderTopRightRadius: radius["3xl"],
    padding: spacing["2xl"],
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  statusText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background.brandPrimary,
  },
  sosButton: {
    backgroundColor: colors.text.error,
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sosText: {
    color: colors.text.white,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
  },
  instructorInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  instructorName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  rating: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },
  address: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  time: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.xl,
  },
  cancelButton: {
    backgroundColor: colors.background.tertiary,
    padding: spacing.xl,
    borderRadius: radius.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.text.error,
  },
  cancelButtonText: {
    color: colors.text.error,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  rateButton: {
    backgroundColor: colors.background.brandPrimary,
    padding: spacing.xl,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  rateButtonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.brandPrimary,
    borderWidth: 3,
    borderColor: colors.text.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  userMarkerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.white,
  },
  instructorMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF6D00",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.text.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickupMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.text.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
