import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme";

export default function PackagesScreen() {
    const router = useRouter();
    const { data: plans, isLoading, refetch } = trpc.plan.myPlans.useQuery();
    const utils = trpc.useContext();

    const toggleMutation = trpc.plan.toggleActivity.useMutation({
        onSuccess: () => {
            utils.plan.myPlans.invalidate();
        },
        onError: (err) => {
            Alert.alert("Erro", "Não foi possível alterar o status do pacote.");
        }
    });

    const deleteMutation = trpc.plan.delete.useMutation({
        onSuccess: () => {
            utils.plan.myPlans.invalidate();
            Alert.alert("Sucesso", "Pacote removido com sucesso.");
        },
        onError: (err) => {
            Alert.alert("Erro", "Não foi possível remover o pacote.");
        }
    });

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            "Remover Pacote",
            `Tem certeza que deseja remover o pacote "${name}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: () => deleteMutation.mutate({ id })
                },
            ]
        );
    };

    const handleToggle = (id: string) => {
        toggleMutation.mutate({ id });
    };

    const renderPackage = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>
                        {item.lessons} aula{item.lessons > 1 ? 's' : ''}
                    </Text>
                </View>
                <Switch
                    value={item.isActive}
                    onValueChange={() => handleToggle(item.id)}
                    trackColor={{ false: colors.border.secondary, true: colors.background.brandPrimary }}
                />
            </View>

            <View style={styles.cardDetails}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Preço:</Text>
                    <Text style={styles.priceValue}>R$ {Number(item.price).toFixed(2)}</Text>
                </View>
                {item.discount > 0 && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{item.discount}% OFF</Text>
                    </View>
                )}
            </View>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id, item.name)}
            >
                <Ionicons name="trash-outline" size={20} color={colors.text.error} />
                <Text style={styles.deleteText}>Remover</Text>
            </TouchableOpacity>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Meus Pacotes</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.background.brandPrimary} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Meus Pacotes</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                {plans && plans.length > 0 ? (
                    <FlatList
                        data={plans}
                        keyExtractor={(item) => item.id}
                        renderItem={renderPackage}
                        contentContainerStyle={styles.list}
                        ListFooterComponent={
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => router.push("/screens/packages/create")}
                            >
                                <Ionicons name="add-circle" size={24} color={colors.text.white} />
                                <Text style={styles.addButtonText}>Criar Novo Pacote</Text>
                            </TouchableOpacity>
                        }
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="pricetags-outline" size={64} color={colors.text.tertiary} />
                        <Text style={styles.emptyTitle}>Nenhum pacote criado</Text>
                        <Text style={styles.emptySubtitle}>
                            Crie pacotes de aulas para atrair mais alunos.
                        </Text>
                        <TouchableOpacity
                            style={styles.addButtonPrimary}
                            onPress={() => router.push("/screens/packages/create")}
                        >
                            <Ionicons name="add-circle" size={24} color={colors.text.white} />
                            <Text style={styles.addButtonText}>Criar Primeiro Pacote</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
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
    content: {
        flex: 1,
        padding: spacing.lg,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    list: {
        paddingBottom: spacing['2xl'],
    },
    card: {
        backgroundColor: colors.background.secondary,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.secondary,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: spacing.md,
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    cardSubtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    cardDetails: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.lg,
        gap: spacing.md,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
    },
    priceLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    priceValue: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
    },
    discountBadge: {
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: radius.sm,
    },
    discountText: {
        color: '#34D399',
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
    },
    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.md,
        borderRadius: radius.md,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        gap: spacing.xs,
    },
    deleteText: {
        color: colors.text.error,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.lg,
        backgroundColor: colors.background.brandPrimary,
        borderRadius: radius.lg,
        marginTop: spacing.lg,
        gap: spacing.md,
    },
    addButtonText: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.white,
    },
    addButtonPrimary: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.xl,
        backgroundColor: colors.background.brandPrimary,
        borderRadius: radius.lg,
        marginTop: spacing.xl,
        gap: spacing.md,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: spacing['4xl'],
    },
    emptyTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
        marginTop: spacing.xl,
        marginBottom: spacing.xs,
    },
    emptySubtitle: {
        fontSize: typography.fontSize.base,
        color: colors.text.secondary,
        textAlign: "center",
        marginBottom: spacing['2xl'],
    },
});
