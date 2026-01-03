import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, Platform } from "react-native";
import { useNotifications } from "@/hooks/useNotifications";
import { AuthProvider } from "@/contexts/AuthContext";
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
  // Detectar tema do sistema
  const colorScheme = useColorScheme();

  // Inicializar notificações push (apenas em mobile)
  // Inicializar notificações push
  useNotifications();

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
          url: process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? "http://10.0.2.2:3000/api/trpc" : "http://localhost:3000/api/trpc"),
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

  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register/index" />
              <Stack.Screen name="register/vehicle" />
              <Stack.Screen name="forgot-password" />
              <Stack.Screen name="success" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="screens/SolicitarAulaFlow"
                options={{
                  title: "Solicitar Aula",
                  presentation: "fullScreenModal",
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="screens/onboarding/OnboardingFlow"
                options={{
                  title: "Complete seu Cadastro",
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="screens/editProfile"
                options={{
                  title: "Editar Perfil",
                  presentation: "card",
                  headerShown: true,
                }}
              />
            </Stack>
          </AuthProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </TamaguiProvider>
  );
}
