import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";
import { useState } from "react";

export default function CreatePackageScreen() {
    const router = useRouter();
    const utils = trpc.useContext();

    const [name, setName] = useState("");
    const [lessons, setLessons] = useState("5");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("0");
    const [description, setDescription] = useState("");

    const createMutation = trpc.plan.create.useMutation({
        onSuccess: () => {
            utils.plan.myPlans.invalidate();
            Alert.alert("Sucesso", "Pacote criado com sucesso!");
            router.back();
        },
        onError: (err) => {
            Alert.alert("Erro", err.message || "Falha ao criar pacote");
        }
    });

    const handleSubmit = () => {
        if (!name || !lessons || !price) {
            Alert.alert("Atenção", "Preencha os campos obrigatórios");
            return;
        }

        createMutation.mutate({
            name,
            lessons: parseInt(lessons),
            price: parseFloat(price.replace(',', '.')),
            discount: parseInt(discount) || 0,
            description
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Novo Pacote</Text>
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={createMutation.isLoading}
                >
                    {createMutation.isLoading ? (
                        <ActivityIndicator size="small" color={colors.background.brandPrimary} />
                    ) : (
                        <Text style={styles.headerAction}>Salvar</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Nome */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nome do Pacote *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Pacote Iniciante"
                        placeholderTextColor={colors.text.tertiary}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Aulas */}
                <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Qtd. Aulas *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="5"
                            placeholderTextColor={colors.text.tertiary}
                            value={lessons}
                            onChangeText={setLessons}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Desconto (%)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0"
                            placeholderTextColor={colors.text.tertiary}
                            value={discount}
                            onChangeText={setDiscount}
                            keyboardType="number-pad"
                        />
                    </View>
                </View>

                {/* Preço */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Preço Total (R$) *</Text>
                    <TextInput
                        style={[styles.input, styles.priceInput]}
                        placeholder="0,00"
                        placeholderTextColor={colors.text.tertiary}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="decimal-pad"
                    />
                    <Text style={styles.helperText}>
                        Valor por aula: R$ {lessons && price ? (parseFloat(price.replace(',', '.')) / parseInt(lessons)).toFixed(2) : '0,00'}
                    </Text>
                </View>

                {/* Descrição */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Descrição (Opcional)</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Benefícios deste pacote..."
                        placeholderTextColor={colors.text.tertiary}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.secondary,
        backgroundColor: colors.background.secondary,
    },
    headerTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
    },
    headerAction: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.bold,
        color: colors.background.brandPrimary,
    },
    content: {
        padding: spacing.xl,
        gap: spacing.lg,
    },
    row: {
        flexDirection: "row",
        gap: spacing.lg,
    },
    formGroup: {
        marginBottom: spacing.md,
    },
    label: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
    },
    input: {
        backgroundColor: colors.background.secondary,
        borderWidth: 1,
        borderColor: colors.border.secondary,
        borderRadius: radius.md,
        padding: spacing.md,
        color: colors.text.primary,
        fontSize: typography.fontSize.base,
    },
    priceInput: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
    },
    textArea: {
        minHeight: 100,
    },
    helperText: {
        fontSize: typography.fontSize.xs,
        color: colors.text.tertiary,
        marginTop: 4,
    },
});
