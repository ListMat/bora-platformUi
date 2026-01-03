import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { trpc } from "@/lib/trpc";
import { ProfileCompleteness } from "@/components/ProfileCompleteness";
import { YStack, XStack, Text, ScrollView, useTheme } from 'tamagui';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';

export default function ProfileScreen() {
  const router = useRouter();
  const { data: user, isLoading: isLoadingUser } = trpc.user.me.useQuery();
  const { data: student } = trpc.student.getMyProfile.useQuery();
  const { data: completeness } = trpc.student.checkCompleteness.useQuery();
  const theme = useTheme();

  if (!isLoadingUser && !student && user) {
    return (
      <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} backgroundColor="$background">
        <YStack ai="center" space="$6" maxWidth={400} w="100%">
          <Ionicons name="person-add-outline" size={64} color={theme.color.val} style={{ opacity: 0.5 }} />
          <YStack ai="center" space="$2">
            <Text fontSize="$6" fontWeight="bold">Complete seu cadastro</Text>
            <Text textAlign="center" opacity={0.7} lineHeight={24}>Para começar a usar o BORA, você precisa completar seu cadastro.</Text>
          </YStack>
          <Button onPress={() => router.push("/screens/onboarding/OnboardingFlow")} size="$5" fullWidth>
            Começar Cadastro
          </Button>
        </YStack>
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
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} backgroundColor="$background">
      <YStack pt="$8" px="$4" pb="$4">
        <Text fontSize="$8" fontWeight="bold" mb="$4">Meu Perfil</Text>

        {/* Profile Completeness */}
        {completeness && (
          <YStack mb="$6">
            <ProfileCompleteness
              isComplete={completeness.isComplete}
              missingFields={completeness.missingFields}
              totalFields={7}
            />
          </YStack>
        )}

        {/* Avatar */}
        <YStack ai="center" mb="$6">
          <Avatar size="$10" circular>
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback backgroundColor="$muted">
              <Text fontSize="$6" fontWeight="bold">
                {user?.name?.charAt(0) || "U"}
              </Text>
            </AvatarFallback>
          </Avatar>
          <Text mt="$3" fontSize="$5" fontWeight="bold">{user?.name || "Usuário BORA"}</Text>
          <Text fontSize="$3" opacity={0.6}>{user?.email || "usuario@bora.com"}</Text>
        </YStack>

        {/* Dados Pessoais */}
        <YStack space="$4" mb="$6">
          <Text fontSize="$4" fontWeight="600" opacity={0.7} ml="$1">Dados Pessoais</Text>

          <Card bordered>
            <YStack space="$4">
              <InfoRow label="Nome" value={user?.name || "Usuário BORA"} />
              <InfoRow label="E-mail" value={user?.email || "usuario@bora.com"} />
              <InfoRow label="Telefone" value={user?.phone || "Não informado"} />
              {student && (
                <>
                  <InfoRow label="CPF" value={formatCPF(student.cpf)} />
                  <InfoRow label="Data de Nascimento" value={formatDate(student.dateOfBirth)} />
                </>
              )}
            </YStack>
          </Card>
        </YStack>

        {/* Endereço */}
        {student && (student.address || student.city || student.state) && (
          <YStack space="$4" mb="$6">
            <Text fontSize="$4" fontWeight="600" opacity={0.7} ml="$1">Endereço</Text>
            <Card bordered>
              <YStack space="$4">
                {student.address && <InfoRow label="Endereço" value={student.address} />}
                <InfoRow
                  label="Cidade / Estado"
                  value={`${student.city || "Não informado"} ${student.city && student.state ? "/" : ""} ${student.state || ""}`}
                />
                {student.zipCode && <InfoRow label="CEP" value={student.zipCode.replace(/(\d{5})(\d{3})/, "$1-$2")} />}
              </YStack>
            </Card>
          </YStack>
        )}

        {/* Progresso */}
        {student && (
          <YStack space="$4" mb="$6">
            <Text fontSize="$4" fontWeight="600" opacity={0.7} ml="$1">Progresso</Text>
            <XStack space="$4">
              <Card flex={1} bordered ai="center" jc="center" py="$4">
                <Text fontSize="$7" fontWeight="bold" color="$primary">{student.points || 0}</Text>
                <Text fontSize="$3" opacity={0.6}>Pontos</Text>
              </Card>
              <Card flex={1} bordered ai="center" jc="center" py="$4">
                <Text fontSize="$7" fontWeight="bold" color="$primary">{student.level || 1}</Text>
                <Text fontSize="$3" opacity={0.6}>Nível</Text>
              </Card>
            </XStack>
          </YStack>
        )}

        {/* Buttons */}
        <YStack space="$3" mt="$2">
          {!completeness?.isComplete && (
            <Button
              backgroundColor="$green9"
              onPress={() => router.push("/screens/onboarding/OnboardingFlow")}
              icon={<Ionicons name="checkmark-circle" size={20} color="white" />}
            >
              Completar Cadastro
            </Button>
          )}

          <Button
            onPress={() => router.push("/screens/editProfile")}
            icon={<Ionicons name="create-outline" size={20} color="white" />}
          >
            Editar Perfil
          </Button>

          <Button
            variant="outline"
            borderColor="$red8"
            color="$red10"
            onPress={() => {
              Alert.alert("Sair", "Tem certeza que deseja sair?", [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Sair", style: "destructive", onPress: () => {
                    router.replace("/login");
                  }
                },
              ]);
            }}
            icon={<Ionicons name="log-out-outline" size={20} color="red" />}
            pressStyle={{ backgroundColor: '$red2', borderColor: '$red8' }}
          >
            Sair
          </Button>
        </YStack>

      </YStack>
    </ScrollView>
  );
}

const InfoRow = ({ label, value }: { label: string, value: string }) => (
  <YStack>
    <Text fontSize="$2" opacity={0.5} mb={2} textTransform="uppercase">{label}</Text>
    <Text fontSize="$4" fontWeight="500">{value}</Text>
  </YStack>
)
