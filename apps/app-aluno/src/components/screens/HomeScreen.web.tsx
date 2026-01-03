import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { trpc } from "@/lib/trpc";
import { colors, radius, spacing, typography } from "@/theme";
import { useHaptic } from "@/hooks/useHaptic";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import WebMap from "@/components/WebMap";
import { useAuth } from "../../contexts/AuthContext";

const { width, height } = Dimensions.get("window");



// Localização padrão (centro do Brasil - Brasília)
const DEFAULT_LOCATION = {
  latitude: -15.7942,
  longitude: -47.8822,
  zoomLevel: 10,
};

export default function HomeScreen() {
  const router = useRouter();
  const haptic = useHaptic();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; zoomLevel?: number } | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);

  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [lastLessonConfig, setLastLessonConfig] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const homeMapRef = useRef<any>(null);

  const cardAnimation = useRef(new Animated.Value(height)).current;

  // Localização para exibir no mapa (usa a do usuário ou padrão)
  const mapLocation = userLocation || DEFAULT_LOCATION;

  // Buscar dados do usuário
  // Buscar dados do usuário
  const { user } = useAuth();

  // Buscar localização do usuário
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        const location = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          zoomLevel: 12,
        };
        setUserLocation(location);
      } catch (error) {
        console.error("Error getting location:", error);
      }
    })();
  }, []);

  // Carregar última configuração de aula
  useEffect(() => {
    (async () => {
      try {
        const config = await AsyncStorage.getItem('last_lesson_config');
        if (config) {
          setLastLessonConfig(JSON.parse(config));
        }
      } catch (error) {
        console.error("Error loading last config:", error);
      }
    })();
  }, []);

  // Buscar instrutores próximos (sempre habilitado, mesmo sem localização)
  const { data: instructors = [], isLoading } = trpc.instructor.nearby.useQuery(
    {
      latitude: mapLocation.latitude,
      longitude: mapLocation.longitude,
      radius: 10,
      limit: 20,
    },
    {
      enabled: true, // Sempre habilitado
    }
  );

  // Animar card quando instrutor é selecionado
  useEffect(() => {
    if (selectedInstructor) {
      Animated.spring(cardAnimation, {
        toValue: height - 280,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.spring(cardAnimation, {
        toValue: height - 130,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    }
  }, [selectedInstructor]);

  const handleMarkerPress = (instructorId: string) => {
    setSelectedInstructor(instructorId);

    const instructor = instructors.find((i) => i.id === instructorId);
    /* TODO: Implementar animação para Web se necessário
    if (instructor && instructor.latitude && instructor.longitude && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: instructor.latitude,
        longitude: instructor.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
    */
  };



  const selectedInstructorData = instructors.find(
    (i) => i.id === selectedInstructor
  );

  const renderInstructorCard = ({ item }: { item: any }) => {
    const isSelected = selectedInstructor === item.id;
    const mainVehicle = item.vehicles?.[0];

    return (
      <TouchableOpacity
        style={[styles.instructorCard, isSelected && styles.instructorCardSelected]}
        onPress={() => {
          haptic.light();
          handleMarkerPress(item.id);
        }}
        activeOpacity={0.8}
      >
        {item.user.image ? (
          <Image
            source={{ uri: item.user.image }}
            style={styles.instructorCardImage}
          />
        ) : (
          <View style={styles.instructorCardImagePlaceholder}>
            <Ionicons name="person" size={20} color={colors.text.tertiary} />
          </View>
        )}
        <View style={styles.instructorCardInfo}>
          <View style={styles.instructorCardHeader}>
            <Text style={styles.instructorCardName} numberOfLines={1}>
              {item.user.name || "Instrutor"}
            </Text>
            {item.user.emailVerified && (
              <Ionicons name="checkmark-circle" size={16} color="#3B82F6" />
            )}
          </View>
          <View style={styles.instructorCardRating}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.instructorCardRatingText}>
              {item.averageRating?.toFixed(1) || "0.0"} ({item.totalLessons || 0})
            </Text>
          </View>
          {mainVehicle && (
            <View style={styles.instructorCardVehicle}>
              <Text style={styles.instructorCardVehicleText} numberOfLines={1}>
                {mainVehicle.brand} {mainVehicle.model}
              </Text>
              {mainVehicle.plateLast4 && (
                <Text style={styles.instructorCardPlate}>
                  {mainVehicle.plateLast4}
                </Text>
              )}
            </View>
          )}
          <Text style={styles.instructorCardPrice}>
            R$ {Number(item.basePrice || 0).toFixed(0)}/hora
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.mapContainer}>
        <WebMap
          userLocation={userLocation}
          instructors={instructors}
          onMarkerPress={handleMarkerPress}
          selectedInstructorId={selectedInstructor}
        />

        <TouchableOpacity
          style={styles.expandMapButton}
          onPress={() => {
            haptic.light();
            setIsMapExpanded(true);
          }}
          accessibilityLabel="Expandir mapa"
          accessibilityRole="button"
        >
          <Ionicons
            name="expand"
            size={24}
            color={colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Header com busca e saudação */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Para onde vamos hoje?"
            placeholderTextColor={colors.text.placeholder}
            editable={false}
          />
        </View>

        <Text style={styles.greeting}>
          Olá, {user?.name ? user.name.split(" ")[0] : "Visitante"} 👋
        </Text>

        <Text style={styles.prompt}>Onde você quer começar?</Text>

        {/* Botão "Aula em 1 clique" */}
        {lastLessonConfig && (
          <TouchableOpacity
            style={styles.quickBookCard}
            onPress={() => {
              haptic.medium();
              router.push({
                pathname: "/screens/SolicitarAulaFlow",
                params: { quickBook: "true" },
              });
            }}
          >
            <View style={styles.quickBookHeader}>
              <Ionicons name="flash" size={24} color={colors.background.brandPrimary} />
              <Text style={styles.quickBookTitle}>Aula em 1 clique</Text>
            </View>
            <View style={styles.quickBookDetails}>
              <View style={styles.quickBookDetail}>
                <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
                <Text style={styles.quickBookDetailText}>
                  {lastLessonConfig.time} · {lastLessonConfig.lessonType}
                </Text>
              </View>
              <View style={styles.quickBookDetail}>
                <Ionicons name="cash-outline" size={16} color={colors.text.secondary} />
                <Text style={styles.quickBookDetailText}>
                  R$ {lastLessonConfig.price} · {lastLessonConfig.paymentMethod}
                </Text>
              </View>
            </View>
            <View style={styles.quickBookButton}>
              <Text style={styles.quickBookButtonText}>CONFIRMAR AGORA</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.text.white} />
            </View>
          </TouchableOpacity>
        )}

        {/* Filtros */}

      </View>

      {/* Card do instrutor selecionado */}
      {selectedInstructorData && (
        <Animated.View
          style={[
            styles.selectedInstructorCard,
            {
              transform: [{ translateY: cardAnimation }],
            },
          ]}
        >
          <View style={styles.selectedInstructorContent}>
            <View style={styles.selectedInstructorHeader}>
              {selectedInstructorData.user.image ? (
                <Image
                  source={{ uri: selectedInstructorData.user.image }}
                  style={styles.selectedInstructorImage}
                />
              ) : (
                <View style={styles.selectedInstructorImagePlaceholder}>
                  <Ionicons name="person" size={24} color={colors.text.tertiary} />
                </View>
              )}
              <View style={styles.selectedInstructorInfo}>
                <View style={styles.selectedInstructorNameRow}>
                  <Text style={styles.selectedInstructorName}>
                    {selectedInstructorData.user.name || "Instrutor"}
                  </Text>
                  {selectedInstructorData.user.emailVerified && (
                    <Ionicons name="checkmark-circle" size={18} color="#3B82F6" />
                  )}
                </View>
                <View style={styles.selectedInstructorRatingRow}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.selectedInstructorRating}>
                    {selectedInstructorData.averageRating?.toFixed(1) || "0.0"} ({selectedInstructorData.totalLessons || 0})
                  </Text>
                  <View style={styles.credentialBadge}>
                    <Text style={styles.credentialBadgeText}>Credencial</Text>
                  </View>
                </View>
              </View>
            </View>

            {selectedInstructorData.vehicles?.[0] && (
              <View style={styles.selectedInstructorVehicle}>
                {selectedInstructorData.vehicles[0].photoUrl ? (
                  <Image
                    source={{ uri: selectedInstructorData.vehicles[0].photoUrl }}
                    style={styles.selectedInstructorVehicleImage}
                  />
                ) : (
                  <View style={styles.selectedInstructorVehicleImagePlaceholder}>
                    <Ionicons name="car" size={24} color={colors.text.tertiary} />
                  </View>
                )}
                <View style={styles.selectedInstructorVehicleInfo}>
                  <Text style={styles.selectedInstructorVehicleName}>
                    {selectedInstructorData.vehicles[0].brand} {selectedInstructorData.vehicles[0].model}
                  </Text>
                  {selectedInstructorData.vehicles[0].plateLast4 && (
                    <Text style={styles.selectedInstructorVehiclePlate}>
                      {selectedInstructorData.vehicles[0].plateLast4}
                    </Text>
                  )}
                </View>
              </View>
            )}

            <View style={styles.selectedInstructorPrice}>
              <Text style={styles.selectedInstructorPriceLabel}>Valor Por Aula</Text>
              <Text style={styles.selectedInstructorPriceValue}>
                R$ {Number(selectedInstructorData.basePrice || 0).toFixed(0)}/hora
              </Text>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Cards de instrutores em scroll horizontal */}
      <Animated.View
        style={[
          styles.cardsContainer,
          {
            transform: [{ translateY: cardAnimation }],
          },
        ]}
      >
        {instructors.length === 0 && !isLoading ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="map-outline" size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyStateTitle}>Nenhum instrutor próximo</Text>
            <Text style={styles.emptyStateText}>
              Não há instrutores disponíveis na sua região no momento.
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => {
                haptic.medium();
                router.push("/search");
              }}
            >
              <Text style={styles.emptyStateButtonText}>Buscar instrutores</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={instructors}
            keyExtractor={(item) => item.id}
            renderItem={renderInstructorCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsList}
            snapToInterval={width * 0.85}
            decelerationRate="fast"
            ListEmptyComponent={
              isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.background.brandPrimary} />
                  <Text style={styles.loadingText}>Buscando instrutores...</Text>
                </View>
              ) : null
            }
          />
        )}
      </Animated.View>

      {/* Modal de mapa expandido */}
      {/* TODO: Descomentar quando adicionar mapas de volta
      <ExpandMapModal
        visible={isMapExpanded}
        instructors={instructors}
        region={{
          latitude: mapLocation.latitude,
          longitude: mapLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onClose={() => setIsMapExpanded(false)}
      />
      */}

      {/* Floating Action Button - Solicitar Aula */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          haptic.medium();
          router.push({
            pathname: "/screens/SolicitarAulaFlow",
            params: { instructorId: selectedInstructor || undefined },
          });
        }}
        activeOpacity={0.9}
      >
        <View style={styles.fabContent}>
          <Ionicons name="add" size={28} color={colors.text.white} />
          <Text style={styles.fabText}>Solicitar Aula</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  expandMapButton: {
    position: "absolute",
    top: spacing["4xl"],
    right: spacing.xl,
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: spacing["4xl"],
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  greeting: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  prompt: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  filtersContainer: {
    paddingRight: spacing.xl,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.background.secondary,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  filterChipActive: {
    backgroundColor: colors.background.tertiary,
    borderColor: colors.background.brandPrimary,
  },
  filterChipText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  filterChipTextActive: {
    color: colors.text.primary,
  },
  quickBookCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.background.brandPrimary,
  },
  quickBookHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  quickBookTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  quickBookDetails: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  quickBookDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  quickBookDetailText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  quickBookButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.brandPrimary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  quickBookButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.white,
  },
  selectedInstructorCard: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: radius["3xl"],
    borderTopRightRadius: radius["3xl"],
    paddingTop: spacing.xl,
    paddingBottom: spacing["4xl"],
    paddingHorizontal: spacing.xl,
    zIndex: 20,
    maxHeight: height * 0.5,
  },
  selectedInstructorContent: {
    flex: 1,
  },
  selectedInstructorHeader: {
    flexDirection: "row",
    marginBottom: spacing.lg,
  },
  selectedInstructorImage: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    marginRight: spacing.md,
  },
  selectedInstructorImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.background.tertiary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  selectedInstructorInfo: {
    flex: 1,
  },
  selectedInstructorNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  selectedInstructorName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginRight: spacing.xs,
  },
  selectedInstructorRatingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedInstructorRating: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  credentialBadge: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginLeft: spacing.sm,
  },
  credentialBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.white,
    fontWeight: typography.fontWeight.medium,
  },
  selectedInstructorVehicle: {
    flexDirection: "row",
    marginBottom: spacing.lg,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  selectedInstructorVehicleImage: {
    width: 60,
    height: 40,
    borderRadius: radius.md,
    marginRight: spacing.md,
  },
  selectedInstructorVehicleImagePlaceholder: {
    width: 60,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.background.quaternary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  selectedInstructorVehicleInfo: {
    flex: 1,
    justifyContent: "center",
  },
  selectedInstructorVehicleName: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  selectedInstructorVehiclePlate: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  selectedInstructorPrice: {
    alignItems: "flex-end",
  },
  selectedInstructorPriceLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  selectedInstructorPriceValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  cardsContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    paddingBottom: spacing["4xl"],
    zIndex: 15,
  },
  cardsList: {
    paddingHorizontal: spacing.xl,
  },
  instructorCard: {
    width: width * 0.85,
    backgroundColor: colors.background.secondary,
    borderRadius: radius["2xl"],
    padding: spacing.lg,
    marginRight: spacing.lg,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "transparent",
  },
  instructorCardSelected: {
    borderColor: colors.background.brandPrimary,
  },
  instructorCardImage: {
    width: 60,
    height: 60,
    borderRadius: radius.xl,
    marginRight: spacing.md,
  },
  instructorCardImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: radius.xl,
    backgroundColor: colors.background.tertiary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  instructorCardInfo: {
    flex: 1,
  },
  instructorCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  instructorCardName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginRight: spacing.xs,
  },
  instructorCardRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  instructorCardRatingText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  instructorCardVehicle: {
    marginBottom: spacing.xs,
  },
  instructorCardVehicleText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  instructorCardPlate: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  instructorCardPrice: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.background.brandPrimary,
  },
  markerContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    minWidth: 60,
  },
  markerContainerSelected: {
    backgroundColor: colors.background.brandPrimary,
    borderColor: colors.background.brandPrimary,
  },
  markerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  markerRating: {
    fontSize: typography.fontSize.xs,
    color: colors.text.primary,
    marginLeft: spacing.xs,
    fontWeight: typography.fontWeight.medium,
  },
  userLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.background.brandPrimary,
    borderWidth: 3,
    borderColor: colors.text.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userLocationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.white,
    alignSelf: "center",
    marginTop: 2,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing["4xl"],
    minHeight: 200,
  },
  emptyStateTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  emptyStateButton: {
    backgroundColor: colors.background.brandPrimary,
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    marginTop: spacing.md,
  },
  emptyStateButtonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing["4xl"],
    minHeight: 200,
  },
  loadingText: {
    marginTop: spacing.lg,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  fab: {
    position: "absolute",
    bottom: spacing["6xl"],
    right: spacing.xl,
    backgroundColor: colors.background.brandPrimary,
    borderRadius: radius.full,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing["2xl"],
    zIndex: 100,
    shadowColor: colors.background.brandPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  fabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  fabText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.white,
  },
  // Estilos dos markers do mapa
  userLocationMarker: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userLocationDot: {
    width: 16,
    height: 16,
    borderRadius: radius.full,
    backgroundColor: '#3B82F6',
    borderWidth: 3,
    borderColor: colors.background.secondary,
  },
  markerContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerContainerSelected: {
    borderColor: colors.background.brandPrimary,
    backgroundColor: colors.background.tertiary,
  },
  markerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  markerRating: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
});
