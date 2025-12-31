import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { trpc } from "@/lib/trpc";

let Notifications: any;
let Device: any;

try {
  Notifications = require("expo-notifications");
  Device = require("expo-device");
} catch (e) {
  console.warn("expo-notifications or expo-device not installed");
}

// Configurar como as notificações devem ser apresentadas
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
  if (Platform.OS === 'web') {
    return {
      expoPushToken: null,
      notification: null
    };
  }

  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<any>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  const registerTokenMutation = trpc.notification.registerToken.useMutation();

  useEffect(() => {
    if (!Notifications || !Device) {
      return;
    }

    // Registrar token
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
        // Enviar token para o backend
        registerTokenMutation.mutate({ token });
      }
    });

    // Listener para notificações recebidas enquanto app está em foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification: any) => {
        setNotification(notification);
      }
    );

    // Listener para quando usuário toca na notificação
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response: any) => {
        const data = response.notification.request.content.data;

        // Navegar baseado no tipo de notificação
        if (data?.type === "lesson_accepted") {
          // TODO: Navegar para tela da aula
        } else if (data?.type === "lesson_starting") {
          // TODO: Navegar para tela de aula ao vivo
        } else if (data?.type === "emergency_resolved") {
          // TODO: Mostrar mensagem
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

  return {
    expoPushToken,
    notification,
  };
}

async function registerForPushNotificationsAsync() {
  if (!Device || !Notifications) {
    return null;
  }

  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#00C853",
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

