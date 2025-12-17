import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import RescheduleModal from "./RescheduleModal";
import { colors, spacing, radius, typography } from "@/theme";

export default function LessonChatScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const { data: lesson, isLoading: isLoadingLesson } = trpc.lesson.getById.useQuery(
    { lessonId: lessonId! },
    { enabled: !!lessonId }
  );
  const { data: messages, refetch, isLoading } = trpc.chat.listMessages.useQuery(
    { lessonId: lessonId! },
    { enabled: !!lessonId }
  );
  const sendMutation = trpc.chat.sendMessage.useMutation();
  const acceptMutation = trpc.lesson.acceptRequest.useMutation();
  const rejectMutation = trpc.lesson.rejectRequest.useMutation();
  const flatListRef = useRef<FlatList>(null);

  // Timer de 2 minutos para responder solicitação
  useEffect(() => {
    if (lesson?.status === "SCHEDULED" && !lesson.startedAt) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null) return 120; // 2 minutos
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lesson]);

  // Get current user ID
  useEffect(() => {
    const loadUserId = async () => {
      const userId = await SecureStore.getItemAsync("user_id");
      setCurrentUserId(userId);
    };
    loadUserId();
  }, []);

  const handleAccept = async () => {
    try {
      await acceptMutation.mutateAsync({ lessonId: lessonId! });
      Alert.alert("Sucesso", "Aula aceita! O aluno foi notificado.");
      refetch();
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  const handleReject = async () => {
    Alert.alert(
      "Recusar Aula",
      "Tem certeza que deseja recusar esta solicitação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Recusar",
          style: "destructive",
          onPress: async () => {
            try {
              await rejectMutation.mutateAsync({
                lessonId: lessonId!,
                reason: "Não disponível neste horário",
              });
              Alert.alert("Aula recusada", "O aluno foi notificado.");
              router.back();
            } catch (error: any) {
              Alert.alert("Erro", error.message);
            }
          },
        },
      ]
    );
  };

  const handleReschedule = () => {
    setShowRescheduleModal(true);
  };

  const rescheduleMutation = trpc.lesson.reschedule.useMutation({
    onSuccess: () => {
      Alert.alert("Sucesso", "Aula reagendada! O aluno foi notificado.");
      setShowRescheduleModal(false);
      refetch();
    },
    onError: (error) => {
      Alert.alert("Erro", error.message);
    },
  });

  const handleConfirmReschedule = async (newDate: Date) => {
    rescheduleMutation.mutate({
      lessonId: lessonId!,
      newScheduledAt: newDate,
    });
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMutation.mutateAsync({
        lessonId: lessonId!,
        content: message.trim(),
      });
      setMessage("");
      setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderMessage = ({ item }: any) => {
    const isMe = item.senderId === currentUserId;
    const isSystem = item.senderId === "system";

    if (isSystem) {
      return (
        <View style={styles.systemMessage}>
          <Text style={styles.systemText}>{item.content}</Text>
        </View>
      );
    }

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

  const renderActionButtons = () => {
    if (lesson?.status === "SCHEDULED" && !lesson.startedAt) {
      return (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={handleAccept}
            disabled={acceptMutation.isLoading}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.acceptButtonText}>Aceitar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rescheduleButton}
            onPress={handleReschedule}
          >
            <Ionicons name="calendar" size={20} color={colors.background.brandPrimary} />
            <Text style={styles.rescheduleButtonText}>Trocar horário</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={handleReject}
            disabled={rejectMutation.isLoading}
          >
            <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
            <Text style={styles.rejectButtonText}>Recusar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (lesson?.status === "COMPLETED" && !lesson.payment?.status) {
      return (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.generatePixButton}
            onPress={() => {
              router.push({
                pathname: "/screens/generatePix",
                params: { lessonId: lessonId! },
              });
            }}
          >
            <Ionicons name="qr-code" size={20} color="#fff" />
            <Text style={styles.generatePixButtonText}>Gerar Pix</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  if (isLoadingLesson || isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.background.brandPrimary} />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Aula não encontrada</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            {lesson.student?.user?.name || "Aluno"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {lesson.status === "SCHEDULED" && !lesson.startedAt
              ? timeRemaining !== null
                ? `Responder em ${formatTime(timeRemaining)}`
                : "Aguardando resposta"
              : lesson.status}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      {renderActionButtons()}

      {/* Messages */}
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
          </View>
        }
      />

      {/* Input */}
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

      {/* Reschedule Modal */}
      {lesson && (
        <RescheduleModal
          visible={showRescheduleModal}
          onClose={() => setShowRescheduleModal(false)}
          lessonId={lessonId!}
          currentDate={new Date(lesson.scheduledAt)}
          onReschedule={handleConfirmReschedule}
        />
      )}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
    gap: spacing.lg,
    backgroundColor: colors.background.secondary,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  actionButtons: {
    flexDirection: "row",
    padding: spacing.xl,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
    backgroundColor: colors.background.secondary,
  },
  acceptButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.success,
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  acceptButtonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  rescheduleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.brand,
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  rescheduleButtonText: {
    color: colors.background.brandPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  rejectButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.tertiary,
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  rejectButtonText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  generatePixButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.brandPrimary,
    padding: spacing.xl,
    borderRadius: radius.md,
    gap: spacing.md,
  },
  generatePixButtonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
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
  systemMessage: {
    alignSelf: "center",
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: radius.md,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.brand,
  },
  systemText: {
    fontSize: typography.fontSize.sm,
    color: colors.background.brandPrimary,
    textAlign: "center",
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
  errorText: {
    fontSize: typography.fontSize.base,
    color: colors.text.error,
    textAlign: "center",
  },
});

