import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useRef } from "react";
import Pusher from "pusher-js/react-native";
import * as SecureStore from "expo-secure-store";

export default function LessonChatScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { data: messages, refetch, isLoading } = trpc.chat.listMessages.useQuery({ lessonId });
  const sendMutation = trpc.chat.sendMessage.useMutation();
  const flatListRef = useRef<FlatList>(null);

  // Get current user ID
  useEffect(() => {
    const loadUserId = async () => {
      const userId = await SecureStore.getItemAsync("user_id");
      setCurrentUserId(userId);
    };
    loadUserId();
  }, []);

  // Setup Pusher para receber mensagens em tempo real
  useEffect(() => {
    const pusherKey = process.env.EXPO_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.EXPO_PUBLIC_PUSHER_CLUSTER || "us2";

    if (!pusherKey) {
      console.warn("Pusher key not configured");
      return;
    }

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    const channel = pusher.subscribe(`lesson-${lessonId}`);

    channel.bind("new-message", () => {
      refetch(); // Atualizar lista ao receber nova mensagem
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [lessonId, refetch]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMutation.mutateAsync({
        lessonId,
        content: message.trim(),
      });
      setMessage("");
      setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const renderMessage = ({ item }: any) => {
    const isMe = item.senderId === currentUserId;
    return (
      <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={[styles.messageText, isMe && styles.myMessageText]}>
          {item.content}
        </Text>
        <Text style={[styles.messageTime, isMe && styles.myMessageTime]}>
          {new Date(item.createdAt).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma mensagem ainda</Text>
            <Text style={styles.emptySubtext}>
              Envie uma mensagem para começar a conversa
            </Text>
          </View>
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim() || sendMutation.isLoading}
        >
          <Text style={styles.sendButtonText}>
            {sendMutation.isLoading ? "..." : "Enviar"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  messagesList: { padding: 16, flexGrow: 1 },
  messageBubble: { maxWidth: "80%", padding: 12, borderRadius: 16, marginBottom: 8 },
  myMessage: { alignSelf: "flex-end", backgroundColor: "#00C853" },
  theirMessage: { alignSelf: "flex-start", backgroundColor: "#f0f0f0" },
  messageText: { fontSize: 16, marginBottom: 4, color: "#333" },
  myMessageText: { color: "#fff" },
  messageTime: { fontSize: 12, color: "#666" },
  myMessageTime: { color: "#e0e0e0" },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#00C853",
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  sendButtonText: { color: "#fff", fontWeight: "bold" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
});

