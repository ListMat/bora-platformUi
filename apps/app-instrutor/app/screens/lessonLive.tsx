import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

export default function LessonLiveScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [instructorLocation, setInstructorLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data: lesson, isLoading, refetch } = trpc.lesson.getById.useQuery(
    { lessonId: id },
    { refetchInterval: 5000 }
  );

  const startMutation = trpc.lesson.start.useMutation({
    onSuccess: () => {
      Alert.alert("Sucesso", "Aula iniciada");
      refetch();
    },
    onError: (error) => {
      Alert.alert("Erro", error.message);
    },
  });

  const endMutation = trpc.lesson.end.useMutation({
    onSuccess: () => {
      Alert.alert("Sucesso", "Aula finalizada");
      router.push(`/screens/rating?lessonId=${id}`);
    },
    onError: (error) => {
      Alert.alert("Erro", error.message);
    },
  });

  const updateLocationMutation = trpc.lesson.updateLocation.useMutation();

  const cancelMutation = trpc.lesson.cancel.useMutation({
    onSuccess: () => {
      Alert.alert("Sucesso", "Aula cancelada");
      router.back();
    },
    onError: (error) => {
      Alert.alert("Erro", error.message);
    },
  });

  // Tracking de localização a cada 5 segundos
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erro", "Permissão de localização necessária");
        return;
      }

      // Localização inicial
      const loc = await Location.getCurrentPositionAsync({});
      const currentLocation = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setInstructorLocation(currentLocation);

      // Atualizar no backend se a aula estiver ativa ou agendada
      if (lesson?.status === "ACTIVE" || lesson?.status === "SCHEDULED") {
        updateLocationMutation.mutate({
          lessonId: id,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        });
      }

      // Iniciar tracking contínuo
      locationIntervalRef.current = setInterval(async () => {
        const newLoc = await Location.getCurrentPositionAsync({});
        const newLocation = {
          latitude: newLoc.coords.latitude,
          longitude: newLoc.coords.longitude,
        };
        setInstructorLocation(newLocation);

        if (lesson?.status === "ACTIVE" || lesson?.status === "SCHEDULED") {
          updateLocationMutation.mutate({
            lessonId: id,
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
          });
        }
      }, 5000); // 5 segundos
    })();

    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  }, [lesson?.status]);

  if (isLoading || !lesson) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6D00" />
      </View>
    );
  }

  const studentLocation = lesson.pickupLatitude && lesson.pickupLongitude
    ? { latitude: lesson.pickupLatitude, longitude: lesson.pickupLongitude }
    : null;

  const handleStart = () => {
    Alert.alert(
      "Iniciar Aula",
      "Confirma o início da aula?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Iniciar", onPress: () => startMutation.mutate({ lessonId: id }) },
      ]
    );
  };

  const handleEnd = () => {
    Alert.alert(
      "Finalizar Aula",
      "Confirma a finalização da aula?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Finalizar", onPress: () => endMutation.mutate({ lessonId: id }) },
      ]
    );
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

  return (
    <View style={styles.container}>
      {/* Mapa */}
      {instructorLocation && (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: instructorLocation.latitude,
            longitude: instructorLocation.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {/* Marcador do instrutor */}
          <Marker
            coordinate={instructorLocation}
            title="Você"
            pinColor="#FF6D00"
          />

          {/* Marcador do aluno/pickup */}
          {studentLocation && (
            <Marker
              coordinate={studentLocation}
              title={lesson.student.user.name || "Aluno"}
              description="Local de encontro"
              pinColor="#00C853"
            />
          )}
        </MapView>
      )}

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.header}>
          <Text style={styles.studentName}>{lesson.student.user.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lesson.status) }]}>
            <Text style={styles.statusText}>{getStatusLabel(lesson.status)}</Text>
          </View>
        </View>

        <Text style={styles.address}>{lesson.pickupAddress}</Text>
        <Text style={styles.time}>
          Agendada para: {new Date(lesson.scheduledAt).toLocaleString('pt-BR')}
        </Text>

        {lesson.startedAt && (
          <Text style={styles.time}>
            Iniciada às: {new Date(lesson.startedAt).toLocaleTimeString('pt-BR')}
          </Text>
        )}

        {/* Botões de ação */}
        <View style={styles.actions}>
          {lesson.status === "SCHEDULED" && (
            <>
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]} 
                onPress={handleStart}
                disabled={startMutation.isLoading}
              >
                <Text style={styles.buttonText}>
                  {startMutation.isLoading ? "Iniciando..." : "Iniciar Aula"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={handleCancel}
                disabled={cancelMutation.isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}

          {lesson.status === "ACTIVE" && (
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={handleEnd}
              disabled={endMutation.isLoading}
            >
              <Text style={styles.buttonText}>
                {endMutation.isLoading ? "Finalizando..." : "Finalizar Aula"}
              </Text>
            </TouchableOpacity>
          )}

          {lesson.status === "FINISHED" && (
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]}
              onPress={() => router.push(`/screens/rating?lessonId=${id}`)}
            >
              <Text style={styles.buttonText}>Avaliar Aluno</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "SCHEDULED": return "#FFA500";
    case "ACTIVE": return "#00C853";
    case "FINISHED": return "#666";
    case "CANCELLED": return "#FF0000";
    default: return "#999";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "SCHEDULED": return "Agendada";
    case "ACTIVE": return "Em andamento";
    case "FINISHED": return "Finalizada";
    case "CANCELLED": return "Cancelada";
    default: return status;
  }
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  studentName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: "#999",
    marginBottom: 16,
  },
  instructorInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  instructorName: {
    fontSize: 18,
    fontWeight: "600",
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
  },
  actions: {
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#FF6D00",
  },
  cancelButton: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#FF0000",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButtonText: {
    color: "#FF0000",
    fontSize: 16,
    fontWeight: "600",
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
});
