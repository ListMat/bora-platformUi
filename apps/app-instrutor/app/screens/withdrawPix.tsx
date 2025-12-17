import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function WithdrawPixScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [pixKeyType, setPixKeyType] = useState<"CPF" | "EMAIL" | "PHONE" | "RANDOM">("CPF");

  const { data: balance } = trpc.instructor.balance.useQuery();
  const withdrawMutation = trpc.instructor.withdraw.useMutation({
    onSuccess: () => {
      Alert.alert(
        "Sucesso",
        "Saque solicitado com sucesso! O valor será transferido em até 1 dia útil.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    },
    onError: (error) => {
      Alert.alert("Erro", error.message);
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleWithdraw = () => {
    const amountNum = parseFloat(amount.replace(/[^\d,]/g, "").replace(",", "."));

    if (!amountNum || amountNum <= 0) {
      Alert.alert("Erro", "Digite um valor válido");
      return;
    }

    if (amountNum > Number(balance?.available || 0)) {
      Alert.alert("Erro", "Saldo insuficiente");
      return;
    }

    if (amountNum < 10) {
      Alert.alert("Erro", "Valor mínimo de saque é R$ 10,00");
      return;
    }

    if (!pixKey.trim()) {
      Alert.alert("Erro", "Digite a chave Pix");
      return;
    }

    Alert.alert(
      "Confirmar Saque",
      `Deseja solicitar o saque de ${formatCurrency(amountNum)} para a chave Pix ${pixKey}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            withdrawMutation.mutate({
              amount: amountNum,
              pixKey: pixKey.trim(),
            });
          },
        },
      ]
    );
  };

  const handleAmountChange = (text: string) => {
    // Remove tudo exceto números e vírgula
    const cleaned = text.replace(/[^\d,]/g, "");
    // Permite apenas uma vírgula
    const parts = cleaned.split(",");
    if (parts.length > 2) return;
    // Limita a 2 casas decimais
    if (parts[1] && parts[1].length > 2) return;
    setAmount(cleaned);
  };

  const formatAmount = () => {
    if (!amount) return "";
    const num = parseFloat(amount.replace(",", "."));
    if (isNaN(num)) return "";
    return formatCurrency(num);
  };

  const availableBalance = Number(balance?.available || 0);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Solicitar Saque Pix</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Disponível</Text>
          <Text style={styles.balanceValue}>{formatCurrency(availableBalance)}</Text>
          <Text style={styles.balanceSubtext}>
            Disponível para saque em D+1
          </Text>
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Valor do Saque</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>R$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0,00"
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
          {amount && (
            <Text style={styles.formattedAmount}>{formatAmount()}</Text>
          )}
          <Text style={styles.helperText}>Valor mínimo: R$ 10,00</Text>
        </View>

        {/* Pix Key Type */}
        <View style={styles.section}>
          <Text style={styles.label}>Tipo de Chave Pix</Text>
          <View style={styles.keyTypeContainer}>
            {(["CPF", "EMAIL", "PHONE", "RANDOM"] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.keyTypeButton,
                  pixKeyType === type && styles.keyTypeButtonSelected,
                ]}
                onPress={() => setPixKeyType(type)}
              >
                <Text
                  style={[
                    styles.keyTypeText,
                    pixKeyType === type && styles.keyTypeTextSelected,
                  ]}
                >
                  {type === "CPF"
                    ? "CPF"
                    : type === "EMAIL"
                    ? "E-mail"
                    : type === "PHONE"
                    ? "Telefone"
                    : "Chave Aleatória"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pix Key Input */}
        <View style={styles.section}>
          <Text style={styles.label}>
            {pixKeyType === "CPF"
              ? "CPF"
              : pixKeyType === "EMAIL"
              ? "E-mail"
              : pixKeyType === "PHONE"
              ? "Telefone"
              : "Chave Pix"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={
              pixKeyType === "CPF"
                ? "000.000.000-00"
                : pixKeyType === "EMAIL"
                ? "seu@email.com"
                : pixKeyType === "PHONE"
                ? "(00) 00000-0000"
                : "Chave Pix aleatória"
            }
            value={pixKey}
            onChangeText={setPixKey}
            keyboardType={
              pixKeyType === "EMAIL"
                ? "email-address"
                : pixKeyType === "PHONE" || pixKeyType === "CPF"
                ? "numeric"
                : "default"
            }
            placeholderTextColor="#999"
          />
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#FF6D00" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Como funciona:</Text>
            <Text style={styles.infoText}>
              • O saque será processado em até 1 dia útil{'\n'}
              • O valor será creditado na chave Pix informada{'\n'}
              • Você receberá uma notificação quando o saque for concluído
            </Text>
          </View>
        </View>

        {/* Withdraw Button */}
        <TouchableOpacity
          style={[
            styles.withdrawButton,
            (withdrawMutation.isLoading ||
              !amount ||
              !pixKey ||
              parseFloat(amount.replace(",", ".")) <= 0 ||
              parseFloat(amount.replace(",", ".")) > availableBalance) &&
              styles.withdrawButtonDisabled,
          ]}
          onPress={handleWithdraw}
          disabled={
            withdrawMutation.isLoading ||
            !amount ||
            !pixKey ||
            parseFloat(amount.replace(",", ".")) <= 0 ||
            parseFloat(amount.replace(",", ".")) > availableBalance
          }
        >
          {withdrawMutation.isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cash" size={24} color="#fff" />
              <Text style={styles.withdrawButtonText}>Solicitar Saque</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  balanceCard: {
    backgroundColor: "#FFF3E0",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF6D00",
    marginBottom: 8,
  },
  balanceSubtext: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
  formattedAmount: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  keyTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  keyTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "transparent",
  },
  keyTypeButtonSelected: {
    backgroundColor: "#FFF3E0",
    borderColor: "#FF6D00",
  },
  keyTypeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  keyTypeTextSelected: {
    color: "#FF6D00",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#333",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  withdrawButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6D00",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 32,
    gap: 8,
  },
  withdrawButtonDisabled: {
    opacity: 0.5,
  },
  withdrawButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

