import {
  Dimensions,
  Modal,
  Platform,
} from "react-native";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { YStack, XStack, Text, useTheme, Image as TamaguiImage } from 'tamagui';
import { Sheet } from '@/components/ui/Sheet';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { Badge, BadgeText } from '@/components/ui/Badge';

import MapView, { Marker } from "react-native-maps";
import { MAP_PROVIDER, MAP_STYLES } from "@/lib/maps";
import { useHaptic } from "@/hooks/useHaptic";
import { FlatList } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

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
  const flatListRef = useRef<FlatList>(null);
  const theme = useTheme();

  // Auto-fit logic
  useEffect(() => {
    if (visible && instructors.length > 0 && mapRef.current) {
      const coordinates = instructors
        .filter((i) => i.latitude && i.longitude)
        .map((i) => ({
          latitude: i.latitude!,
          longitude: i.longitude!,
        }));

      if (coordinates.length > 0) {
        setTimeout(() => {
          mapRef.current?.fitToCoordinates(coordinates, {
            edgePadding: {
              top: 100,
              right: 60,
              bottom: 300,
              left: 60,
            },
            animated: true,
          });
        }, 300);
      }
    }
  }, [visible, instructors]);

  const handleMarkerPress = (instructorId: string) => {
    setSelectedInstructor(instructorId);
    // Animate map logic...
    const instructor = instructors.find((i) => i.id === instructorId);
    if (instructor && instructor.latitude && instructor.longitude && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: instructor.latitude,
        longitude: instructor.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
    // Scroll list logic
    const index = instructors.findIndex((i) => i.id === instructorId);
    if (index >= 0) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }
  };

  const renderInstructorCard = ({ item }: { item: Instructor }) => {
    const isSelected = selectedInstructor === item.id;
    return (
      <Card
        width={width * 0.85}
        mr="$4"
        bordered={!isSelected}
        borderColor={isSelected ? '$primary' : '$borderColor'}
        borderWidth={isSelected ? 2 : 1}
        onPress={() => handleMarkerPress(item.id)}
        p="$4"
        backgroundColor="$background"
      >
        <XStack space="$3" mb="$3">
          <Avatar size="$5" circular>
            <AvatarImage src={item.user.image || undefined} />
            <AvatarFallback backgroundColor="$muted">
              <Ionicons name="person" size={20} color={theme.color.val} />
            </AvatarFallback>
          </Avatar>
          <YStack flex={1}>
            <XStack ai="center" mb="$1">
              <Text fontWeight="700" fontSize="$4" numberOfLines={1}>{item.user.name}</Text>
              {item.user.emailVerified && <Ionicons name="checkmark-circle" size={16} color="#3B82F6" style={{ marginLeft: 4 }} />}
            </XStack>
            <XStack ai="center" space="$2">
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text fontSize="$3" opacity={0.7}>{item.averageRating?.toFixed(1)} ({item.totalLessons})</Text>
            </XStack>
          </YStack>
          <YStack ai="flex-end">
            <Text fontWeight="700" color="$primary" fontSize="$5">R$ {Math.round(item.basePrice || 0)}</Text>
            <Text fontSize="$2" opacity={0.6}>/hora</Text>
          </YStack>
        </XStack>

        {item.vehicles?.[0] && (
          <XStack bg="$muted" p="$2" br="$2" mb="$3" ai="center" space="$2">
            <Ionicons name="car" size={16} color={theme.color.val} />
            <Text fontSize="$3" numberOfLines={1}>{item.vehicles[0].brand} {item.vehicles[0].model}</Text>
          </XStack>
        )}

        <Button
          onPress={() => {
            onClose();
            router.push({
              pathname: "/screens/SolicitarAulaFlow",
              params: { instructorId: item.id },
            });
          }}
          fullWidth
        >
          Ver disponibilidade
        </Button>
      </Card>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <YStack f={1} bg="$background">
        {region && (
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            provider={MAP_PROVIDER}
            customMapStyle={MAP_STYLES.airbnb}
            initialRegion={{
              ...region,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation={true}
          >
            {instructors.map((instructor) => {
              if (!instructor.latitude || !instructor.longitude) return null;
              const isSelected = selectedInstructor === instructor.id;
              return (
                <Marker
                  key={instructor.id}
                  coordinate={{ latitude: instructor.latitude, longitude: instructor.longitude }}
                  onPress={() => handleMarkerPress(instructor.id)}
                >
                  <YStack ai="center" jc="center" scale={isSelected ? 1.2 : 1}>
                    <Avatar size="$4" circular borderWidth={2} borderColor="white">
                      <AvatarImage src={instructor.user.image || undefined} />
                      <AvatarFallback bg="$muted" />
                    </Avatar>
                    <Badge position="absolute" bottom={-8} bg="$primary" px="$1.5" py={2} br={12}>
                      <XStack ai="center" space={2}>
                        <Ionicons name="star" size={8} color="white" />
                        <Text fontSize={10} color="white" fontWeight="bold">{instructor.averageRating?.toFixed(1)}</Text>
                      </XStack>
                    </Badge>
                  </YStack>
                </Marker>
              )
            })}
          </MapView>
        )}

        <Button
          position="absolute"
          top={Platform.OS === 'ios' ? 60 : 40}
          right={20}
          circular
          size="$4"
          icon={<Ionicons name="close" size={24} color={theme.color.val} />}
          onPress={onClose}
          bg="$background"
          elevation={5}
        />

        <Sheet
          modal={false} // Inline
          open={true}
          snapPoints={[25, 50, 90]}
          dismissOnSnapToBottom={false}
          position={0} // Default index
        >
          <Sheet.Overlay />
          <Sheet.Frame padding="$4" bg="$background" elevation={10}>
            <Sheet.Handle />
            <Text fontSize="$6" fontWeight="bold" mb="$4" px="$2">Instrutores próximos</Text>
            {instructors.length === 0 ? (
              <YStack ai="center" py="$6">
                <Ionicons name="location" size={48} color={theme.color.val} style={{ opacity: 0.3 }} />
                <Text mt="$4" opacity={0.6}>Nenhum instrutor nesta área.</Text>
              </YStack>
            ) : (
              <FlatList
                ref={flatListRef}
                data={instructors}
                horizontal
                renderItem={renderInstructorCard}
                showsHorizontalScrollIndicator={false}
                snapToInterval={width * 0.85 + 16} // card width + margin
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 20 }}
              />
            )}
          </Sheet.Frame>
        </Sheet>
      </YStack>
    </Modal>
  );
}
