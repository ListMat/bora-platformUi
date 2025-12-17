import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";

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
        <StatusBar style="light" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="screens/withdrawPix"
            options={{
              title: "Solicitar Saque Pix",
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="screens/generatePix"
            options={{
              title: "Gerar Pix",
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="screens/vehicles"
            options={{
              title: "Meus Veículos",
              presentation: "card",
            }}
          />
          <Stack.Screen
            name="screens/addVehicle"
            options={{
              title: "Cadastrar Veículo",
              presentation: "card",
            }}
          />
        </Stack>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
