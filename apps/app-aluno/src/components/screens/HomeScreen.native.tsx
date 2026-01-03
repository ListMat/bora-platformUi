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
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { trpc } from "@/lib/trpc";
import { colors, radius, spacing, typography } from "@/theme";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { MAP_PROVIDER } from "@/lib/maps";
import { useHaptic } from "@/hooks/useHaptic";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient"; // Adicionar se disponível ou usar View com background
import { InstructorDetailModal } from "../modals/InstructorDetailModal";
import { useAuth } from "../../contexts/AuthContext";

const { width, height } = Dimensions.get("window");

// Localização padrão (centro do Brasil - Brasília)
const DEFAULT_LOCATION = {
  latitude: -19.9167,
  longitude: -43.9345,
  zoomLevel: 12,
};

export default function HomeScreen() {
  const router = useRouter();
  const haptic = useHaptic();
  const insets = useSafeAreaInsets();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; zoomLevel?: number } | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [lastLessonConfig, setLastLessonConfig] = useState<any>(null);
  const mapRef = useRef<MapView>(null);
  const homeMapRef = useRef<MapView>(null);
  const cardAnimation = useRef(new Animated.Value(0)).current;

  // Localização para exibir no mapa (usa a do usuário ou padrão)
  const mapLocation = userLocation || DEFAULT_LOCATION;

  // Buscar dados do usuário via Contexto de Autenticação
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
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.spring(cardAnimation, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    }
  }, [selectedInstructor]);

  const handleMarkerPress = (instructorId: string) => {
    setSelectedInstructor(instructorId);

    const instructor = instructors.find((i) => i.id === instructorId);
    if (instructor && instructor.latitude && instructor.longitude && homeMapRef.current) {
      homeMapRef.current.animateToRegion({
        latitude: instructor.latitude,
        longitude: instructor.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* Header com busca e saudação (Agora fora do mapa) */}
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

        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            Olá, {user?.name ? user.name.split(" ")[0] : "Visitante"} 👋
          </Text>
          <Text style={styles.prompt}>Onde você quer começar?</Text>
        </View>
      </View>

      {/* Mapa Container (Flex e arredondado) */}
      <View style={styles.mapContainerOuter}>
        <MapView
          ref={homeMapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? undefined : MAP_PROVIDER}
          mapType={Platform.OS === 'android' ? "none" : "standard"}
          rotateEnabled={false}
          initialRegion={{
            latitude: mapLocation.latitude,
            longitude: mapLocation.longitude,
            latitudeDelta: mapLocation.zoomLevel ? (20 - mapLocation.zoomLevel) * 0.01 : 0.05,
            longitudeDelta: mapLocation.zoomLevel ? (20 - mapLocation.zoomLevel) * 0.01 : 0.05,
          }}
          showsUserLocation={false}
          showsMyLocationButton={false}
          toolbarEnabled={false}
          customMapStyle={[
            {
              "featureType": "all",
              "elementType": "geometry",
              "stylers": [{ "color": "#f5f5f5" }] // Mapa mais claro conforme imagem
            }
          ]}
        >
          {/* Debug Info */}
          <Marker coordinate={mapLocation} zIndex={999}>
            <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 5 }}>
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                Instructors: {instructors.length}
                {'\n'}
                Loading: {isLoading ? 'Yes' : 'No'}
              </Text>
            </View>
          </Marker>
          {Platform.OS === 'android' && (
            <UrlTile
              urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
              zIndex={-1}
            />
          )}

          {/* Usuário */}
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              identifier="user-location"
            >
              <View style={styles.userLocationMarker}>
                <View style={styles.userLocationDot} />
              </View>
            </Marker>
          )}

          {/* Instrutores */}
          {instructors.map((instructor) => {
            if (!instructor.latitude || !instructor.longitude) return null;

            const isSelected = selectedInstructor === instructor.id;

            return (
              <Marker
                key={instructor.id}
                identifier={`instructor-${instructor.id}`}
                coordinate={{
                  latitude: instructor.latitude,
                  longitude: instructor.longitude,
                }}
                onPress={() => {
                  haptic.light();
                  handleMarkerPress(instructor.id);
                }}
              >
                <View
                  style={[
                    styles.markerContainer,
                    isSelected && styles.markerContainerSelected,
                  ]}
                >
                  <Ionicons name="star" size={12} color={isSelected ? "#FFD700" : "#F59E0B"} />
                  <Text style={[styles.markerRating, isSelected && styles.markerRatingSelected]}>
                    {instructor.averageRating?.toFixed(1) || "4.9"} ({instructor.totalLessons || instructor.ratings?.length || 42})
                  </Text>
                </View>
              </Marker>
            );
          })}
        </MapView>

        {/* Botão expandir mapa */}
        <TouchableOpacity
          style={styles.expandMapButton}
          onPress={() => {
            haptic.light();
            setIsMapExpanded(true);
          }}
          accessibilityLabel="Expandir mapa"
          accessibilityRole="button"
        >
          <Ionicons name="expand" size={16} color={colors.text.white} />
        </TouchableOpacity>

        {/* Card do Instrutor Overlay - Estilo Glass/Dark */}
        {selectedInstructorData && (
          <Animated.View
            style={[
              styles.instructorCardOverlay,
              {
                opacity: cardAnimation,
                transform: [{
                  translateY: cardAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [200, 0]
                  })
                }]
              }
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                haptic.medium();
                setShowDetailModal(true);
              }}
              style={styles.instructorCardContent}
            >
              <View style={styles.cardMainRow}>
                {/* Lado Esquerdo: info instrutor + carro */}
                <View style={styles.cardLeftInfo}>
                  {/* Linha 1: Avatar e Nome */}
                  <View style={styles.instructorHeaderRow}>
                    {selectedInstructorData.user.image ? (
                      <Image
                        source={{ uri: selectedInstructorData.user.image }}
                        style={styles.instructorAvatar}
                      />
                    ) : (
                      <View style={styles.instructorAvatarPlaceholder}>
                        <Ionicons name="person" size={20} color={colors.text.tertiary} />
                      </View>
                    )}

                    <View style={styles.instructorTexts}>
                      <View style={styles.nameRow}>
                        <Text style={styles.instructorName} numberOfLines={1}>
                          {selectedInstructorData.user.name || "Instrutor"}
                        </Text>
                        {selectedInstructorData.user.emailVerified && (
                          <Ionicons name="checkmark-circle" size={14} color="#3B82F6" style={{ marginLeft: 4 }} />
                        )}
                      </View>

                      <View style={styles.ratingBadgeRow}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.ratingText}>
                          {selectedInstructorData.averageRating?.toFixed(1) || "5.0"} ({selectedInstructorData.totalLessons || 42})
                        </Text>
                        <View style={styles.credBadge}>
                          <Text style={styles.credText}>Credencial</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Linha 2: Carro */}
                  <View style={styles.vehicleRow}>
                    {selectedInstructorData.vehicles?.[0] ? (
                      <>
                        <Image
                          source={{ uri: selectedInstructorData.vehicles[0].photoUrl || 'https://via.placeholder.com/100x50' }}
                          style={styles.vehicleImage}
                          resizeMode="contain"
                        />
                        <View style={{ marginLeft: 8 }}>
                          <Text style={styles.vehicleName}>
                            {selectedInstructorData.vehicles[0].brand} {selectedInstructorData.vehicles[0].model}
                          </Text>
                          <Text style={styles.vehiclePlate}>
                            {selectedInstructorData.vehicles[0].plateLast4 ? `PLACA ${selectedInstructorData.vehicles[0].plateLast4}` : 'TXN-7E55'}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <Text style={styles.vehicleName}>Veículo não cadastrado</Text>
                    )}
                  </View>
                </View>

                {/* Lado Direito: Preço */}
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Valor Por Aula</Text>
                  <Text style={styles.priceValue}>
                    R$ {Number(selectedInstructorData.basePrice || 0).toFixed(0)}<Text style={{ fontSize: 12, fontWeight: 'normal' }}>/hora</Text>
                  </Text>
                </View>

              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

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

      <InstructorDetailModal
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        instructor={selectedInstructorData}
      />

      {/* Floating Action Button - Solicitar Aula */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712", // Dark background from Figma
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  expandMapButton: {
    position: "absolute",
    top: spacing.lg,
    right: spacing.lg,
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: "#030712",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827", // Secondary dark
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md, // Taller search bar
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: 16,
    color: "#F9FAFB",
    fontWeight: "500",
  },
  greetingContainer: {
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F9FAFB",
    marginBottom: 4,
  },
  prompt: {
    fontSize: 16,
    color: "#9CA3AF",
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
  // Map styles
  mapContainerOuter: {
    flex: 1,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg, // Give some space at bottom
    borderRadius: 32, // Large rounded corners
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E5E7EB', // Placeholder color if map loads slow
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  // Marker styles matching Figma
  markerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerContainerSelected: {
    backgroundColor: '#1F2937', // Dark when selected
  },
  markerRating: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    color: '#374151',
  },
  markerRatingSelected: {
    color: '#F3F4F6', // Light text when selected
  },
  userLocationMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.2)', // Blue halo
    justifyContent: 'center',
    alignItems: 'center',
  },
  userLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6', // Solid blue dot
    borderWidth: 2,
    borderColor: 'white',
  },

  // Instructor Card Overlay
  instructorCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  instructorCardContent: {
    backgroundColor: "#1F2937", // Dark card
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    // Simulate linear gradient background effect if possible, or just solid dark
  },
  cardMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeftInfo: {
    flex: 1,
    marginRight: 12,
  },
  instructorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#374151',
  },
  instructorAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructorTexts: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  instructorName: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 4,
    marginRight: 8,
  },
  credBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)', // Blue transparent
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  credText: {
    color: '#60A5FA', // Light blue
    fontSize: 10,
    fontWeight: '600',
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleImage: {
    width: 60,
    height: 30,
    marginRight: 4,
  },
  vehicleName: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '500',
  },
  vehiclePlate: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  priceContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  priceLabel: {
    color: '#D1D5DB',
    fontSize: 12,
    marginBottom: 4,
  },
  priceValue: {
    color: '#F9FAFB',
    fontSize: 18,
    fontWeight: 'bold',
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
