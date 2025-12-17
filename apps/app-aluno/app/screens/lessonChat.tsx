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
import { colors, spacing, radius, typography } from "@/theme";

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
        <ActivityIndicator size="large" color={colors.background.brandPrimary} />
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
          placeholderTextColor={colors.text.placeholder}
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
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesList: {
    padding: spacing.xl,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: spacing.lg,
    borderRadius: radius['2xl'],
    marginBottom: spacing.md,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.background.brandPrimary,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: colors.background.tertiary,
  },
  messageText: {
    fontSize: typography.fontSize.base,
    marginBottom: spacing.xs,
    color: colors.text.primary,
  },
  myMessageText: {
    color: colors.text.white,
  },
  messageTime: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  myMessageTime: {
    color: colors.text.secondary,
  },
  inputContainer: {
    flexDirection: "row",
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.secondary,
    backgroundColor: colors.background.secondary,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginRight: spacing.md,
    maxHeight: 100,
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
  },
  sendButton: {
    backgroundColor: colors.background.brandPrimary,
    borderRadius: radius.full,
    paddingHorizontal: spacing['2xl'],
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: colors.background.disabled,
  },
  sendButtonText: {
    color: colors.text.white,
    fontWeight: typography.fontWeight.bold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing['5xl'],
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    textAlign: "center",
    marginBottom: spacing.md,
    color: colors.text.primary,
  },
  emptySubtext: {
    fontSize: typography.fontSize.sm,
    textAlign: "center",
    color: colors.text.tertiary,
  },
});

