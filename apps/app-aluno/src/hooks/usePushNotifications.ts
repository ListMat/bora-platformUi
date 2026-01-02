import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { trpc } from "@/lib/trpc";

/**
 * Hook para registrar e atualizar o push token do Expo
 * 
 * Uso:
 * ```tsx
 * import { usePushNotifications } from "@/hooks/usePushNotifications";
 * 
 * function App() {
 *   usePushNotifications();
 *   // ...
 * }
 * ```
 */
export function usePushNotifications() {
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    const updatePushTokenMutation = trpc.user.updatePushToken.useMutation();

    useEffect(() => {
        // Configurar handler de notificações
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });

        // Registrar push token
        registerForPushNotificationsAsync();

        // Listener para notificações recebidas
        notificationListener.current = Notifications.addNotificationReceivedListener(
            (notification) => {
                console.log("[Push] Notification received:", notification);
            }
        );

        // Listener para quando usuário interage com notificação
        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                console.log("[Push] Notification response:", response);

                // Navegar para tela específica baseado no tipo
                const data = response.notification.request.content.data;

                if (data?.screen) {
                    // TODO: Implementar navegação
                    console.log("[Push] Navigate to:", data.screen, data.params);
                }
            }
        );

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    async function registerForPushNotificationsAsync() {
        try {
            // Verificar se é dispositivo físico
            if (Platform.OS === "android") {
                await Notifications.setNotificationChannelAsync("default", {
                    name: "default",
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: "#00C853",
                });
            }

            // Solicitar permissão
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== "granted") {
                console.log("[Push] Permission not granted");
                return;
            }

            // Obter token
            const token = (await Notifications.getExpoPushTokenAsync({
                projectId: process.env.EXPO_PUBLIC_PROJECT_ID || "your-project-id",
            })).data;

            console.log("[Push] Token obtained:", token);

            // Salvar no backend
            await updatePushTokenMutation.mutateAsync({ pushToken: token });

            console.log("[Push] Token saved to backend");
        } catch (error) {
            console.error("[Push] Error registering for push notifications:", error);
        }
    }
}
