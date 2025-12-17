import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { trpc } from "@/lib/trpc";

// Dynamic imports para evitar erros se as dependências não estiverem instaladas
let Notifications: any;
let Device: any;

try {
  Notifications = require("expo-notifications");
  Device = require("expo-device");
} catch (error) {
  console.warn("expo-notifications or expo-device not installed");
}

// Configurar como as notificações devem ser tratadas quando o app está em foreground
if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export function useNotifications() {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const registerTokenMutation = trpc.notification.registerToken.useMutation();

  useEffect(() => {
    if (!Notifications || !Device) {
      console.warn("Notifications not available");
      return;
    }

    // Solicitar permissões
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        // Registrar token no backend
        registerTokenMutation.mutate({ token });
      }
    });

    // Listener para notificações recebidas quando o app está em foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification: any) => {
        console.log("Notification received:", notification);
      }
    );

    // Listener para quando o usuário toca na notificação
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response: any) => {
        console.log("Notification response:", response);
        // Navegar para a tela apropriada baseado no tipo de notificação
        const data = response.notification.request.content.data;
        if (data?.lessonId) {
          // Navegar para o chat da aula
        }
      }
    );

    return () => {
      if (notificationListener.current && Notifications) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current && Notifications) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return {
    scheduleNotification: async (title: string, body: string, data?: any) => {
      if (!Notifications) {
        console.warn("Notifications not available");
        return;
      }
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: null, // Enviar imediatamente
      });
    },
  };
}

async function registerForPushNotificationsAsync() {
  if (!Notifications || !Device) {
    return null;
  }

  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF6D00",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return null;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return token;
}
