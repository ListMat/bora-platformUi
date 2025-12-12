import Pusher from "pusher";

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.PUSHER_CLUSTER || "us2",
  useTLS: true,
});

// Eventos de chat
export const CHAT_EVENTS = {
  NEW_MESSAGE: "new-message",
  MESSAGE_READ: "message-read",
  USER_TYPING: "user-typing",
};

// Helper para enviar mensagem via Pusher
export async function sendChatNotification(
  lessonId: string,
  event: string,
  data: any
) {
  await pusher.trigger(`lesson-${lessonId}`, event, data);
}

