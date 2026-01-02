import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";
import { trpc } from "@/lib/trpc";
import { ProfileCompleteness } from "@/components/ProfileCompleteness";

export default function ProfileScreen() {
  const router = useRouter();
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'profile.tsx:entry', message: 'Profile screen rendered', data: {}, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
  // #endregion
  const { data: user, isLoading: isLoadingUser } = trpc.user.me.useQuery();
  const { data: student } = trpc.student.getMyProfile.useQuery();
  const { data: completeness } = trpc.student.checkCompleteness.useQuery();

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'profile.tsx:queries', message: 'Queries executed', data: { hasUser: !!user, hasStudent: !!student, hasCompleteness: !!completeness, isLoadingUser }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
  // #endregion

  // Se não tem perfil de estudante, mostrar botão para criar
  if (!isLoadingUser && !student && user) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'profile.tsx:empty-state', message: 'Showing empty state - no student profile', data: { userId: user.id, userRole: user.role }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
    // #endregion
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Meu Perfil</Text>
        <View style={styles.emptyState}>
          <Ionicons name="person-add-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>Complete seu cadastro</Text>
          <Text style={styles.emptyText}>
            Para começar a usar o BORA, você precisa completar seu cadastro.
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              // #region agent log
              fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'profile.tsx:onboarding-button', message: 'Onboarding button pressed', data: {}, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'E' }) }).catch(() => { });
              // #endregion
              router.push("/screens/onboarding/OnboardingFlow");
            }}
          >
            <Text style={styles.createButtonText}>Começar Cadastro</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const formatCPF = (cpf?: string | null) => {
    if (!cpf) return "Não informado";
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatDate = (date?: Date | null) => {
    if (!date) return "Não informado";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Meu Perfil</Text>

      {/* Profile Completeness */}
      {completeness && (
        <ProfileCompleteness
          isComplete={completeness.isComplete}
          missingFields={completeness.missingFields}
          totalFields={7}
        />
      )}

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {user?.image ? (
          <Image source={{ uri: user.image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {user?.name?.charAt(0) || "U"}
            </Text>
          </View>
        )}
      </View>

      {/* Dados Pessoais */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados Pessoais</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{user?.name || "Usuário BORA"}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.value}>{user?.email || "usuario@bora.com"}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.value}>{user?.phone || "Não informado"}</Text>
        </View>
        {student && (
          <>
            <View style={styles.card}>
              <Text style={styles.label}>CPF</Text>
              <Text style={styles.value}>{formatCPF(student.cpf)}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Data de Nascimento</Text>
              <Text style={styles.value}>{formatDate(student.dateOfBirth)}</Text>
            </View>
          </>
        )}
      </View>

      {/* Endereço */}
      {student && (student.address || student.city || student.state) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          {student.address && (
            <View style={styles.card}>
              <Text style={styles.label}>Endereço</Text>
              <Text style={styles.value}>{student.address}</Text>
            </View>
          )}
          <View style={styles.card}>
            <Text style={styles.label}>Cidade / Estado</Text>
            <Text style={styles.value}>
              {student.city || "Não informado"}
              {student.city && student.state ? " / " : ""}
              {student.state || ""}
            </Text>
          </View>
          {student.zipCode && (
            <View style={styles.card}>
              <Text style={styles.label}>CEP</Text>
              <Text style={styles.value}>
                {student.zipCode.replace(/(\d{5})(\d{3})/, "$1-$2")}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Gamificação */}
      {student && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progresso</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Pontos</Text>
            <Text style={styles.value}>{student.points || 0} pontos</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Nível</Text>
            <Text style={styles.value}>Nível {student.level || 1}</Text>
          </View>
        </View>
      )}

      {/* Botões */}
      {!completeness?.isComplete && (
        <TouchableOpacity
          style={[styles.button, styles.completeButton]}
          onPress={() => router.push("/screens/onboarding/OnboardingFlow")}
        >
          <Ionicons name="checkmark-circle" size={20} color={colors.text.white} />
          <Text style={styles.buttonText}>Completar Cadastro</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/screens/editProfile")}
      >
        <Ionicons name="create-outline" size={20} color={colors.text.white} />
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={() => {
          Alert.alert("Sair", "Tem certeza que deseja sair?", [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Sair", style: "destructive", onPress: () => {
                // Redirecionar para login
                router.replace("/login");
              }
            },
          ]);
        }}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.text.primary} />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      <View style={{ height: spacing["4xl"] }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    padding: spacing["2xl"],
    paddingBottom: spacing["4xl"],
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing["4xl"],
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing["2xl"],
  },
  createButton: {
    backgroundColor: colors.background.brandPrimary,
    padding: spacing.xl,
    borderRadius: radius.md,
    paddingHorizontal: spacing["2xl"],
  },
  createButtonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: spacing["2xl"],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: colors.background.tertiary,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.border.secondary,
  },
  avatarInitial: {
    fontSize: typography.fontSize["4xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  section: {
    marginBottom: spacing["2xl"],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.background.secondary,
    padding: spacing.xl,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  label: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
    fontWeight: typography.fontWeight.medium,
  },
  value: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  button: {
    backgroundColor: colors.background.brandPrimary,
    padding: spacing.xl,
    borderRadius: radius.lg,
    alignItems: "center",
    marginTop: spacing.xl,
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
  },
  completeButton: {
    backgroundColor: colors.background.success,
  },
  buttonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  logoutButton: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  logoutText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});
