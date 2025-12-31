import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";
import { trpc } from "@/lib/trpc";
import { CEPInput } from "@/components/CEPInput";

const BRAZILIAN_STATES = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

export default function EditProfileScreen() {
  const router = useRouter();
  const { data: user } = trpc.user.me.useQuery();
  const { data: student } = trpc.student.getMyProfile.useQuery();

  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(student?.address || "");
  const [city, setCity] = useState(student?.city || "");
  const [state, setState] = useState(student?.state || "");
  const [zipCode, setZipCode] = useState(student?.zipCode || "");

  const updateStudent = trpc.student.update.useMutation();
  const updateUser = trpc.user.updateProfile.useMutation();

  const handleAddressFound = (foundAddress: {
    street: string;
    city: string;
    state: string;
    neighborhood?: string;
  }) => {
    setAddress(foundAddress.street);
    setCity(foundAddress.city);
    setState(foundAddress.state);
  };

  const handleSave = async () => {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'editProfile.tsx:handleSave:entry',message:'Edit profile save started',data:{hasStudent:!!student,userId:user?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      if (student) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'editProfile.tsx:handleSave:before-update',message:'Before calling student.update',data:{studentId:student.id,address:address.trim(),city:city.trim(),state,zipCode:zipCode.replace(/\D/g,'')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        await updateStudent.mutateAsync({
          address: address.trim() || undefined,
          city: city.trim() || undefined,
          state: state || undefined,
          zipCode: zipCode.replace(/\D/g, "") || undefined,
          phone: phone.trim() || undefined,
        });
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'editProfile.tsx:handleSave:after-update',message:'Student update successful',data:{studentId:student.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'editProfile.tsx:handleSave:before-user-update',message:'Before calling user.updateProfile',data:{userId:user?.id,phone:phone.trim()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        await updateUser.mutateAsync({
          phone: phone.trim() || undefined,
        });
      }

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'editProfile.tsx:handleSave:error',message:'Edit profile failed',data:{errorMessage:error.message,errorStack:error.stack,hasStudent:!!student},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      Alert.alert("Erro", error.message || "Erro ao atualizar perfil");
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.background.brandPrimary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Editar Perfil</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contato</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="(00) 00000-0000"
            placeholderTextColor={colors.text.tertiary}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {student && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <CEPInput
            label="CEP"
            value={zipCode}
            onChangeText={setZipCode}
            onAddressFound={handleAddressFound}
          />
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={styles.input}
              placeholder="Rua, número, complemento"
              placeholderTextColor={colors.text.tertiary}
              value={address}
              onChangeText={setAddress}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cidade</Text>
            <TextInput
              style={styles.input}
              placeholder="São Paulo"
              placeholderTextColor={colors.text.tertiary}
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estado</Text>
            <View style={styles.stateGrid}>
              {BRAZILIAN_STATES.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.stateButton,
                    state === s && styles.stateButtonSelected,
                  ]}
                  onPress={() => setState(s)}
                >
                  <Text
                    style={[
                      styles.stateText,
                      state === s && styles.stateTextSelected,
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={updateStudent.isLoading || updateUser.isLoading}
        >
          {updateStudent.isLoading || updateUser.isLoading ? (
            <ActivityIndicator color={colors.text.white} />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color={colors.text.white} />
              <Text style={styles.saveButtonText}>Salvar</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing["2xl"],
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
  inputGroup: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  stateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  stateButton: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    minWidth: 50,
    alignItems: "center",
  },
  stateButtonSelected: {
    backgroundColor: colors.background.brandPrimary,
    borderColor: colors.background.brandPrimary,
  },
  stateText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  stateTextSelected: {
    color: colors.text.white,
  },
  buttons: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing["2xl"],
  },
  cancelButton: {
    flex: 1,
    padding: spacing.xl,
    borderRadius: radius.md,
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  cancelButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  saveButton: {
    flex: 1,
    padding: spacing.xl,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.background.brandPrimary,
  },
  saveButtonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});

