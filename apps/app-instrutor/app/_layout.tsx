import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/contexts/AuthContext";
import { Platform } from "react-native";
import { useColorScheme } from "react-native";
import { TamaguiProvider } from 'tamagui'
import config from '../tamagui.config'

// Storage helper que funciona em web e native
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  }
};

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  }));

  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api/trpc",
          async headers() {
            const token = await storage.getItem("auth_token");
            return {
              authorization: token ? `Bearer ${token}` : "",
            };
          },
        }),
      ],
    })
  );

  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register/index" />
              <Stack.Screen name="register/vehicle" />
              <Stack.Screen name="forgot-password" />
              <Stack.Screen name="success" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="screens/withdrawPix"
                options={{
                  title: "Solicitar Saque Pix",
                  presentation: "modal",
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="screens/generatePix"
                options={{
                  title: "Gerar Pix",
                  presentation: "modal",
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="screens/vehicles"
                options={{
                  title: "Meus Veículos",
                  presentation: "card",
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="screens/addVehicle"
                options={{
                  title: "Cadastrar Veículo",
                  presentation: "card",
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="screens/onboarding/OnboardingFlow"
                options={{
                  title: "Cadastro de Instrutor",
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
            </Stack>
          </AuthProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </TamaguiProvider>
  );
}
