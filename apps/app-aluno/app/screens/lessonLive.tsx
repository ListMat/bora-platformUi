import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

export default function LessonLiveScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
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
        <ActivityIndicator size="large" color="#00C853" />
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
        { text: "Sim", style: "destructive", onPress: () => cancelMutation.mutate({ lessonId: id }) },
      ]
    );
  };

  const handleSOS = () => {
    Alert.alert("SOS", "Função SOS será implementada");
    // TODO: Implementar SOS (item 7)
  };

  return (
    <View style={styles.container}>
      {/* Mapa */}
      {userLocation && (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {/* Marcador do aluno */}
          <Marker
            coordinate={userLocation}
            title="Você"
            pinColor="#00C853"
          />

          {/* Marcador do instrutor */}
          {instructorLocation && (
            <Marker
              coordinate={instructorLocation}
              title={lesson.instructor.user.name || "Instrutor"}
              description="Instrutor"
              pinColor="#FF6D00"
            />
          )}

          {/* Marcador do pickup */}
          {lesson.pickupLatitude && lesson.pickupLongitude && (
            <Marker
              coordinate={{
                latitude: lesson.pickupLatitude,
                longitude: lesson.pickupLongitude,
              }}
              title="Local de encontro"
              pinColor="#FFA500"
            />
          )}
        </MapView>
      )}

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.header}>
          <Text style={styles.statusText}>{getStatusMessage()}</Text>
          <TouchableOpacity onPress={handleSOS} style={styles.sosButton}>
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
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
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00C853",
  },
  sosButton: {
    backgroundColor: "#FF0000",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sosText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  instructorInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  instructorName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: "#999",
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF0000",
  },
  cancelButtonText: {
    color: "#FF0000",
    fontSize: 16,
    fontWeight: "600",
  },
  rateButton: {
    backgroundColor: "#00C853",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  rateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
