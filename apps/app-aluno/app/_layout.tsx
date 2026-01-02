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
          url: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api/trpc",
          async headers() {
            const token = await SecureStore.getItemAsync("auth_token");
            return {
              authorization: token ? `Bearer ${token}` : "",
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="screens/SolicitarAulaFlow"
              options={{
                title: "Solicitar Aula",
                presentation: "fullScreenModal",
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
              }}
            />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
