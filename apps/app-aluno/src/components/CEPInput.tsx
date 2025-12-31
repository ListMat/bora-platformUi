import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TextInputProps, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

interface CEPInputProps extends Omit<TextInputProps, "value" | "onChangeText"> {
  value: string;
  onChangeText: (text: string) => void;
  onAddressFound?: (address: { street: string; city: string; state: string; neighborhood?: string }) => void;
  error?: string;
  label?: string;
  required?: boolean;
}

// Função para formatar CEP
function formatCEP(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 5) return numbers;
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
}

// Função para buscar endereço por CEP (ViaCEP API)
async function fetchAddressByCEP(cep: string) {
  const cleanCEP = cep.replace(/\D/g, "");
  if (cleanCEP.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data = await response.json();

    if (data.erro) {
      return null;
    }

    return {
      street: data.logradouro || "",
      neighborhood: data.bairro || "",
      city: data.localidade || "",
      state: data.uf || "",
    };
  } catch (error) {
    console.error("Error fetching CEP:", error);
    return null;
  }
}

export function CEPInput({
  value,
  onChangeText,
  onAddressFound,
  error,
  label,
  required = false,
  ...props
}: CEPInputProps) {
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CEPInput.tsx:handleSearch:entry',message:'CEP search started',data:{value,cleanCEP:value.replace(/\D/g,'')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    const cleanCEP = value.replace(/\D/g, "");
    if (cleanCEP.length !== 8) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CEPInput.tsx:handleSearch:validation-error',message:'Invalid CEP length',data:{cleanCEP,cleanCEPLength:cleanCEP.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      Alert.alert("Erro", "CEP deve ter 8 dígitos");
      return;
    }

    setLoading(true);
    try {
      const address = await fetchAddressByCEP(cleanCEP);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CEPInput.tsx:handleSearch:result',message:'CEP search result',data:{found:!!address,street:address?.street,city:address?.city,state:address?.state},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      if (address) {
        onAddressFound?.(address);
      } else {
        Alert.alert("CEP não encontrado", "Verifique o CEP digitado");
      }
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CEPInput.tsx:handleSearch:error',message:'CEP search failed',data:{errorMessage:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      Alert.alert("Erro", "Não foi possível buscar o endereço");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          {...props}
          style={[styles.input, error && styles.inputError]}
          placeholder="00000-000"
          placeholderTextColor={colors.text.tertiary}
          value={formatCEP(value)}
          onChangeText={(text) => {
            const numbers = text.replace(/\D/g, "");
            if (numbers.length <= 8) {
              onChangeText(numbers);
            }
          }}
          keyboardType="numeric"
          maxLength={9}
        />
        <TouchableOpacity
          style={[styles.searchButton, loading && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={loading || value.replace(/\D/g, "").length !== 8}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.text.white} />
          ) : (
            <Ionicons name="search" size={20} color={colors.text.white} />
          )}
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.text.error,
  },
  inputContainer: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  inputError: {
    borderColor: colors.border.error,
  },
  searchButton: {
    backgroundColor: colors.background.brandPrimary,
    borderRadius: radius.md,
    padding: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 50,
  },
  searchButtonDisabled: {
    opacity: 0.5,
  },
  error: {
    fontSize: typography.fontSize.xs,
    color: colors.text.error,
    marginTop: spacing.xs,
  },
});

