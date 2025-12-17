import { useEffect, useRef } from "react";
import * as Location from "expo-location";
import { trpc } from "@/lib/trpc";

interface UseLocationTrackingOptions {
  enabled: boolean;
  interval?: number; // Intervalo em milissegundos (padrão: 30 segundos)
}

export function useLocationTracking({ enabled, interval = 30000 }: UseLocationTrackingOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const updateLocationMutation = trpc.instructor.updateLocation.useMutation();

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Solicitar permissão de localização
    const requestPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      // Atualizar localização inicial
      updateLocation();

      // Configurar atualização periódica
      intervalRef.current = setInterval(() => {
        updateLocation();
      }, interval);
    };

    const updateLocation = async () => {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        updateLocationMutation.mutate({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error("Error updating location:", error);
      }
    };

    requestPermission();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval]);

  return {
    isUpdating: updateLocationMutation.isLoading,
  };
}

