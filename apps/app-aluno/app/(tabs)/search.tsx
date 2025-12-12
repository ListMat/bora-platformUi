import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Pegar localização do usuário
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Permissão de localização negada");
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (error) {
        setLocationError("Erro ao obter localização");
      }
    })();
  }, []);

  const { data, isLoading, error } = trpc.instructor.nearby.useQuery(
    {
      latitude: location?.latitude || 0,
      longitude: location?.longitude || 0,
      radius: 10,
      limit: 20,
    },
    {
      enabled: !!location,
    }
  );

  const instructors = data || [];

  // Filtrar por nome se houver busca
  const filteredInstructors = searchQuery
    ? instructors.filter((instructor) =>
        instructor.user.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : instructors;

  const renderInstructor = ({ item }: any) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.instructorName}>{item.user.name}</Text>
          <Text style={styles.instructorLocation}>
            {item.city}, {item.state}
          </Text>
          <Text style={styles.distance}>
            {item.distance.toFixed(1)} km de você
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.averageRating.toFixed(1)}</Text>
          <Text style={styles.totalLessons}>{item.totalLessons} aulas</Text>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>R$ {Number(item.basePrice).toFixed(2)}/h</Text>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Agendar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (locationError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{locationError}</Text>
        <Text style={styles.helpText}>Ative a localização nas configurações do app</Text>
      </View>
    );
  }

  if (!location || isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00C853" />
        <Text style={styles.loadingText}>Buscando instrutores próximos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro ao carregar instrutores: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Instrutores</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Digite o nome do instrutor..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {filteredInstructors.length === 0 ? (
      <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            {searchQuery 
              ? "Nenhum instrutor encontrado com esse nome" 
              : "Nenhum instrutor disponível próximo a você"}
          </Text>
      </View>
      ) : (
        <FlatList
          data={filteredInstructors}
          keyExtractor={(item) => item.id}
          renderItem={renderInstructor}
          contentContainerStyle={styles.listContent}
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF0000",
    textAlign: "center",
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#00C853",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  instructorName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  instructorLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  distance: {
    fontSize: 12,
    color: "#00C853",
    fontWeight: "600",
  },
  ratingContainer: {
    alignItems: "flex-end",
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  totalLessons: {
    fontSize: 12,
    color: "#999",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00C853",
  },
  bookButton: {
    backgroundColor: "#00C853",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
