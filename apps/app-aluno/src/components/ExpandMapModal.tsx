import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/theme";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import { MAP_PROVIDER, MAP_STYLES } from "@/lib/maps";
import { useHaptic } from "@/hooks/useHaptic";

const { width, height } = Dimensions.get("window");

interface Instructor {
  id: string;
  user: {
    name: string | null;
    image: string | null;
    emailVerified: Date | null;
  };
  latitude: number | null;
  longitude: number | null;
  averageRating: number | null;
  totalLessons: number | null;
  basePrice: number | null;
  distance?: number;
  vehicles?: Array<{
    brand: string;
    model: string;
    plateLast4: string | null;
    photoUrl: string | null;
  }>;
}

interface ExpandMapModalProps {
  visible: boolean;
  instructors: Instructor[];
  region: { latitude: number; longitude: number; latitudeDelta?: number; longitudeDelta?: number } | null;
  onClose: () => void;
}

export default function ExpandMapModal({
  visible,
  instructors,
  region,
  onClose,
}: ExpandMapModalProps) {
  const router = useRouter();
  const haptic = useHaptic();
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<FlatList>(null);

  // Snap points para o bottom sheet (3 níveis: 25%, 50%, 90%)
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // Ajustar zoom para mostrar todos os instrutores quando o modal abrir
  useEffect(() => {
    if (visible && instructors.length > 0 && mapRef.current) {
      const coordinates = instructors
        .filter((i) => i.latitude && i.longitude)
        .map((i) => [i.longitude!, i.latitude!] as [number, number]);

      if (coordinates.length > 0) {
        setTimeout(() => {
          // Calcular bounds para fitToCoordinates equivalente
          const lons = coordinates.map(c => c[0]);
          const lats = coordinates.map(c => c[1]);
          const minLon = Math.min(...lons);
          const maxLon = Math.max(...lons);
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);

          const centerLon = (minLon + maxLon) / 2;
          const centerLat = (minLat + maxLat) / 2;

          // Calcular zoom level baseado na distância
          const latDelta = maxLat - minLat;
          const lonDelta = maxLon - minLon;
          const maxDelta = Math.max(latDelta, lonDelta);
          const finalLatDelta = maxDelta > 0.1 ? 0.1 : maxDelta > 0.05 ? 0.05 : 0.02;
          const finalLonDelta = maxDelta > 0.1 ? 0.1 : maxDelta > 0.05 ? 0.05 : 0.02;

          mapRef.current?.animateToRegion({
            latitude: centerLat,
            longitude: centerLon,
            latitudeDelta: finalLatDelta,
            longitudeDelta: finalLonDelta,
          }, 500);
        }, 300);
      }
    }
  }, [visible, instructors]);

  const handleMarkerPress = (instructorId: string) => {
    setSelectedInstructor(instructorId);

    const instructor = instructors.find((i) => i.id === instructorId);
    if (instructor && instructor.latitude && instructor.longitude && mapRef.current) {
      // Animar mapa para o instrutor selecionado
      mapRef.current.animateToRegion({
        latitude: instructor.latitude,
        longitude: instructor.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }

    // Expandir bottom sheet e scrollar para o card do instrutor
    bottomSheetRef.current?.snapToIndex(1); // Expande para 400px
    const index = instructors.findIndex((i) => i.id === instructorId);
    if (index >= 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
      }, 300);
    }
  };

  const renderInstructorCard = ({ item, index }: { item: Instructor; index: number }) => {
    const isSelected = selectedInstructor === item.id;

    return (
      <TouchableOpacity
        style={[styles.instructorCard, isSelected && styles.instructorCardSelected]}
        onPress={() => {
          haptic.light();
          handleMarkerPress(item.id);
        }}
        activeOpacity={0.8}
        accessibilityLabel={`Instrutor ${item.user.name || "Sem nome"}, nota ${item.averageRating?.toFixed(1) || "0.0"}`}
        accessibilityRole="button"
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
          {item.distance && (
            <Text style={styles.instructorCardDistance}>
              {item.distance.toFixed(1)} km de distância
            </Text>
          )}
          <Text style={styles.instructorCardPrice}>
            R$ {Number(item.basePrice || 0).toFixed(0)}/hora
          </Text>
          <TouchableOpacity
            style={styles.availabilityButton}
            onPress={() => {
              onClose();
              router.push({
                pathname: "/screens/SolicitarAulaFlow",
                params: { instructorId: item.id },
              });
            }}
          >
            <Text style={styles.availabilityButtonText}>Ver disponibilidade</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={styles.gestureContainer}>
        <StatusBar style="light" translucent />

        {/* MapContainer - Ocupa 100% da tela (absolute) */}
        <View style={styles.mapContainer}>
          {region && (
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={MAP_PROVIDER}
              customMapStyle={MAP_STYLES.dark}
              initialRegion={{
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: region.latitudeDelta || 0.05,
                longitudeDelta: region.longitudeDelta || 0.05,
              }}
              showsUserLocation={false}
              showsMyLocationButton={false}
              toolbarEnabled={false}
            >
              {/* Marcador da localização do usuário */}
              <Marker
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
                identifier="user-location"
              >
                <View style={styles.userLocationMarker}>
                  <View style={styles.userLocationDot} />
                </View>
              </Marker>

              {/* Marcadores dos instrutores */}
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
                    <TouchableOpacity
                      onPress={() => {
                        haptic.light();
                        handleMarkerPress(instructor.id);
                      }}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.markerContainer,
                          isSelected && styles.markerContainerSelected,
                        ]}
                      >
                        {instructor.user.image ? (
                          <Image
                            source={{ uri: instructor.user.image }}
                            style={styles.markerImage}
                          />
                        ) : (
                          <View style={styles.markerImagePlaceholder}>
                            <Ionicons name="person" size={16} color={colors.text.tertiary} />
                          </View>
                        )}
                        <View style={styles.markerContent}>
                          <Ionicons name="star" size={12} color="#FFD700" />
                          <Text style={styles.markerRating}>
                            {instructor.averageRating?.toFixed(1) || "0.0"}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Marker>
                );
              })}
            </MapView>
          )}
        </View>

        {/* Header transparente com botão fechar (absolute sobre o mapa) */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              haptic.light();
              onClose();
            }}
            accessibilityLabel="Fechar mapa"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color={colors.text.white} />
          </TouchableOpacity>
        </View>

        {/* Bottom Sheet (sobre o MapContainer) */}
        <BottomSheet
          ref={bottomSheetRef}
          index={1} // Começa no meio (50%)
          snapPoints={snapPoints}
          enablePanDownToClose={false} // Não fecha ao arrastar para baixo
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.bottomSheetHandleIndicator}
          onChange={(index) => {
            if (index === 2) haptic.light(); // Feedback ao expandir máximo
          }}
        >
          <View style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>Instrutores próximos</Text>

            {instructors.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="location-outline" size={48} color={colors.text.tertiary} />
                <Text style={styles.emptyStateText}>
                  Ninguém por aqui. Tente ampliar a área.
                </Text>
              </View>
            ) : (
              <BottomSheetFlatList
                ref={flatListRef}
                data={instructors}
                keyExtractor={(item) => item.id}
                renderItem={renderInstructorCard}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsList}
                snapToInterval={width * 0.85}
                decelerationRate="fast"
                onScrollToIndexFailed={(info) => {
                  setTimeout(() => {
                    flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                  }, 100);
                }}
              />
            )}
          </View>
        </BottomSheet>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
  },
  // MapContainer - Ocupa 100% da tela
  mapContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  map: {
    flex: 1,
  },
  // Header - Absolute sobre o mapa
  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    right: spacing.xl,
    zIndex: 10,
    backgroundColor: "transparent",
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Bottom Sheet
  bottomSheetBackground: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: radius["3xl"],
    borderTopRightRadius: radius["3xl"],
  },
  bottomSheetHandleIndicator: {
    backgroundColor: colors.border.secondary,
    width: 40,
    height: 4,
  },
  bottomSheetContent: {
    flex: 1,
    paddingTop: spacing.md,
  },
  bottomSheetTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  cardsList: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["4xl"],
  },
  instructorCard: {
    width: width * 0.85,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius["2xl"],
    padding: spacing.lg,
    marginRight: spacing.lg,
    borderWidth: 2,
    borderColor: "transparent",
  },
  instructorCardSelected: {
    borderColor: colors.background.brandPrimary,
    backgroundColor: colors.background.secondary,
  },
  instructorCardImage: {
    width: 60,
    height: 60,
    borderRadius: radius.xl,
    marginBottom: spacing.md,
  },
  instructorCardImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: radius.xl,
    backgroundColor: colors.background.quaternary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
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
  instructorCardDistance: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  instructorCardPrice: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.background.brandPrimary,
    marginBottom: spacing.md,
  },
  availabilityButton: {
    backgroundColor: colors.background.brandPrimary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  availabilityButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.white,
  },
  markerContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius.full,
    padding: spacing.xs,
    borderWidth: 2,
    borderColor: colors.border.secondary,
    alignItems: "center",
    minWidth: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerContainerSelected: {
    borderColor: colors.background.brandPrimary,
    backgroundColor: colors.background.brandPrimary,
    transform: [{ scale: 1.2 }],
  },
  markerImage: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    marginBottom: spacing.xs,
  },
  markerImagePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.background.tertiary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
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
  emptyState: {
    padding: spacing["4xl"],
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    marginTop: spacing.lg,
    textAlign: "center",
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
});
