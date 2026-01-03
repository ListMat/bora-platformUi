import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { colors, spacing, radius, typography } from "@/theme";
import { Ionicons } from "@expo/vector-icons";

// Dados mock para fallback quando a API não estiver disponível
const mockInstructors = [
  {
    id: '2',
    user: {
      id: '2',
      name: 'Instrutor Mestre',
      email: 'instrutor.teste@bora.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    },
    userId: '2',
    cpf: '98765432100',
    cnhNumber: '12345678900',
    city: 'São Paulo',
    state: 'SP',
    basePrice: 80,
    averageRating: 4.8,
    totalLessons: 150,
    distance: 2.5,
    isAvailable: true,
    isOnline: true,
    status: 'ACTIVE' as const,
    bio: 'Instrutor experiente com foco em direção defensiva',
    acceptsOwnVehicle: true,
    latitude: -23.5505,
    longitude: -46.6333,
    vehicles: [
      {
        id: 'v1',
        brand: 'Volkswagen',
        model: 'Gol',
        year: 2022,
        color: 'Branco',
        transmission: 'MANUAL' as const,
        hasDualPedal: true,
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [useMockData, setUseMockData] = useState(false);

  // Pegar localização do usuário
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Permissão de localização negada");
        // Usar localização padrão de São Paulo para mock
        setLocation({ latitude: -23.5505, longitude: -46.6333 });
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
        // Usar localização padrão de São Paulo para mock
        setLocation({ latitude: -23.5505, longitude: -46.6333 });
      }
    })();
  }, []);

  const { data, isLoading, error, refetch } = trpc.instructor.nearby.useQuery(
    {
      latitude: location?.latitude || 0,
      longitude: location?.longitude || 0,
      radius: 10,
      limit: 20,
    },
    {
      enabled: !!location && !useMockData,
      retry: 1,
      onError: (err) => {
        console.error("Erro ao carregar instrutores:", err);
        // Ativar dados mock em caso de erro
        setUseMockData(true);
      },
    }
  );

  // Usar dados mock se houver erro ou se useMockData estiver ativo
  const instructors = useMockData ? mockInstructors : (data || []);

  // Filtrar por nome se houver busca
  const filteredInstructors = searchQuery
    ? instructors.filter((instructor) =>
      instructor.user.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : instructors;

  const renderInstructor = ({ item }: any) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text style={styles.instructorName}>{item.user.name || "Instrutor"}</Text>
          {item.city && item.state && (
            <Text style={styles.instructorLocation}>
              {item.city}, {item.state}
            </Text>
          )}
          {item.distance && (
            <Text style={styles.distance}>
              {item.distance.toFixed(1)} km de você
            </Text>
          )}
        </View>
        <View style={styles.ratingContainer}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>
              {item.averageRating?.toFixed(1) || "0.0"}
            </Text>
          </View>
          <Text style={styles.totalLessons}>
            {item.totalLessons || 0} aulas
          </Text>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          R$ {Number(item.basePrice || 0).toFixed(2)}/h
        </Text>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => {
            router.push({
              pathname: "/screens/SolicitarAulaFlow",
              params: { instructorId: item.id },
            });
          }}
        >
          <Text style={styles.bookButtonText}>Agendar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (locationError) {
    return (
      <View style={styles.centered}>
        <Ionicons name="location-outline" size={48} color={colors.text.error} />
        <Text style={styles.errorText}>{locationError}</Text>
        <Text style={styles.helpText}>Ative a localização nas configurações do app</Text>
      </View>
    );
  }

  if (!location || isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.background.brandPrimary} />
        <Text style={styles.loadingText}>Buscando instrutores próximos...</Text>
      </View>
    );
  }

  if (error) {
    const errorMessage = error.message || "Erro desconhecido";
    const isNetworkError = errorMessage.includes("network") || errorMessage.includes("fetch");
    const isAuthError = errorMessage.includes("401") || errorMessage.includes("403") || errorMessage.includes("Unauthorized");

    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.text.error} />
        <Text style={styles.errorText}>
          {isNetworkError
            ? "Erro de conexão. Verifique sua internet e se a API está rodando."
            : isAuthError
              ? "Erro de autenticação. Faça login novamente."
              : `Erro ao carregar instrutores: ${errorMessage}`}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            // Forçar refetch
            refetch();
            setRetryKey(prev => prev + 1);
          }}
        >
          <Ionicons name="refresh" size={20} color={colors.text.white} />
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Instrutores</Text>

      {useMockData && (
        <View style={styles.mockBanner}>
          <Ionicons name="information-circle" size={20} color={colors.background.brandPrimary} />
          <Text style={styles.mockBannerText}>
            Modo demonstração: Exibindo dados de exemplo
          </Text>
        </View>
      )}

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.text.tertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Digite o nome do instrutor..."
          placeholderTextColor={colors.text.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {filteredInstructors.length === 0 ? (
        <View style={styles.placeholder}>
          <Ionicons name="search-outline" size={48} color={colors.text.tertiary} />
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
    backgroundColor: colors.background.primary,
    padding: spacing["2xl"],
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing["2xl"],
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    paddingVertical: spacing.md,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    textAlign: "center",
    marginTop: spacing.lg,
  },
  errorText: {
    fontSize: typography.fontSize.base,
    color: colors.text.error,
    textAlign: "center",
    marginTop: spacing.md,
    fontWeight: typography.fontWeight.medium,
  },
  helpText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  loadingText: {
    marginTop: spacing.lg,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  listContent: {
    paddingBottom: spacing["2xl"],
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius["2xl"],
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.background.brandPrimary,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  cardInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  instructorLocation: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  distance: {
    fontSize: typography.fontSize.xs,
    color: colors.background.brandPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  ratingContainer: {
    alignItems: "flex-end",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  rating: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginLeft: spacing.xs,
  },
  totalLessons: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.background.brandPrimary,
  },
  bookButton: {
    backgroundColor: colors.background.brandPrimary,
    paddingHorizontal: spacing["3xl"],
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  bookButtonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.brandPrimary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  retryButtonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  mockBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.background.brandPrimary,
    gap: spacing.sm,
  },
  mockBannerText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
});
