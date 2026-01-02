import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { colors, radius, spacing, typography } from "@/theme";
import { useHaptic } from "@/hooks/useHaptic";
import { trpc } from "@/lib/trpc";

interface PixPaymentProps {
    lessonId: string;
    amount: number;
    onPaymentConfirmed?: () => void;
    userType: "student" | "instructor";
}

export default function PixPayment({
    lessonId,
    amount,
    onPaymentConfirmed,
    userType,
}: PixPaymentProps) {
    const haptic = useHaptic();
    const [pixGenerated, setPixGenerated] = useState(false);
    const [pixData, setPixData] = useState<{
        qrCode: string;
        pixCode: string;
        expiresAt: Date;
    } | null>(null);

    const generatePixMutation = trpc.lesson.generatePix.useMutation();
    const confirmPaymentMutation = trpc.lesson.confirmPixPayment.useMutation();

    const handleGeneratePix = async () => {
        try {
            haptic.medium();

            const result = await generatePixMutation.mutateAsync({ lessonId });

            setPixData({
                qrCode: result.qrCode,
                pixCode: result.pixCode,
                expiresAt: new Date(result.expiresAt),
            });
            setPixGenerated(true);

            haptic.success();
        } catch (error) {
            console.error("Error generating Pix:", error);
            Alert.alert("Erro", "Não foi possível gerar o Pix. Tente novamente.");
        }
    };

    const handleCopyPixCode = async () => {
        if (!pixData) return;

        await Clipboard.setStringAsync(pixData.pixCode);
        haptic.light();
        Alert.alert("Copiado!", "Código Pix copiado para a área de transferência");
    };

    const handleConfirmPayment = async () => {
        try {
            haptic.medium();

            await confirmPaymentMutation.mutateAsync({ lessonId });

            haptic.success();
            Alert.alert(
                "Pagamento Confirmado!",
                "O pagamento foi registrado com sucesso.",
                [{ text: "OK", onPress: onPaymentConfirmed }]
            );
        } catch (error) {
            console.error("Error confirming payment:", error);
            Alert.alert("Erro", "Não foi possível confirmar o pagamento.");
        }
    };

    // Instrutor: Botão para gerar Pix
    if (userType === "instructor" && !pixGenerated) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons name="cash-outline" size={24} color={colors.background.brandPrimary} />
                    <Text style={styles.title}>Pagamento</Text>
                </View>

                <Text style={styles.description}>
                    Gere o Pix para receber R$ {amount.toFixed(2)} pela aula
                </Text>

                <TouchableOpacity
                    style={styles.generateButton}
                    onPress={handleGeneratePix}
                    disabled={generatePixMutation.isLoading}
                    activeOpacity={0.8}
                >
                    {generatePixMutation.isLoading ? (
                        <Text style={styles.generateButtonText}>Gerando...</Text>
                    ) : (
                        <>
                            <Ionicons name="qr-code-outline" size={20} color={colors.text.white} />
                            <Text style={styles.generateButtonText}>Gerar Pix</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        );
    }

    // Pix gerado: Mostrar QR Code
    if (pixGenerated && pixData) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons name="qr-code" size={24} color={colors.background.brandPrimary} />
                    <Text style={styles.title}>Pix Gerado</Text>
                </View>

                <Text style={styles.amount}>R$ {amount.toFixed(2)}</Text>

                {/* QR Code */}
                <View style={styles.qrCodeContainer}>
                    <Image
                        source={{ uri: pixData.qrCode }}
                        style={styles.qrCode}
                        resizeMode="contain"
                    />
                </View>

                {/* Código Pix */}
                <View style={styles.pixCodeContainer}>
                    <Text style={styles.pixCodeLabel}>Código Pix:</Text>
                    <Text style={styles.pixCode} numberOfLines={2}>
                        {pixData.pixCode}
                    </Text>
                </View>

                {/* Botão Copiar */}
                <TouchableOpacity
                    style={styles.copyButton}
                    onPress={handleCopyPixCode}
                    activeOpacity={0.8}
                >
                    <Ionicons name="copy-outline" size={18} color={colors.background.brandPrimary} />
                    <Text style={styles.copyButtonText}>Copiar código</Text>
                </TouchableOpacity>

                {/* Aluno: Botão confirmar pagamento */}
                {userType === "student" && (
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={handleConfirmPayment}
                        disabled={confirmPaymentMutation.isLoading}
                        activeOpacity={0.8}
                    >
                        {confirmPaymentMutation.isLoading ? (
                            <Text style={styles.confirmButtonText}>Confirmando...</Text>
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle" size={20} color={colors.text.white} />
                                <Text style={styles.confirmButtonText}>Confirmar Pagamento</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}

                {/* Instrutor: Aguardando confirmação */}
                {userType === "instructor" && (
                    <View style={styles.waitingContainer}>
                        <Ionicons name="time-outline" size={18} color={colors.text.secondary} />
                        <Text style={styles.waitingText}>
                            Aguardando confirmação do aluno...
                        </Text>
                    </View>
                )}

                {/* Expira em */}
                <Text style={styles.expiresText}>
                    Expira em {Math.ceil((pixData.expiresAt.getTime() - Date.now()) / 60000)} minutos
                </Text>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background.secondary,
        borderRadius: radius.xl,
        padding: spacing.lg,
        marginVertical: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.secondary,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
    },
    description: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        marginBottom: spacing.lg,
        lineHeight: 20,
    },
    amount: {
        fontSize: typography.fontSize["3xl"],
        fontWeight: typography.fontWeight.bold,
        color: colors.background.brandPrimary,
        textAlign: "center",
        marginBottom: spacing.lg,
    },
    generateButton: {
        backgroundColor: colors.background.brandPrimary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        paddingVertical: spacing.md,
        borderRadius: radius.lg,
    },
    generateButtonText: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.white,
    },
    qrCodeContainer: {
        alignItems: "center",
        marginBottom: spacing.lg,
        backgroundColor: colors.text.white,
        padding: spacing.md,
        borderRadius: radius.lg,
    },
    qrCode: {
        width: 250,
        height: 250,
    },
    pixCodeContainer: {
        backgroundColor: colors.background.tertiary,
        padding: spacing.md,
        borderRadius: radius.lg,
        marginBottom: spacing.md,
    },
    pixCodeLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
    },
    pixCode: {
        fontSize: typography.fontSize.xs,
        color: colors.text.primary,
        fontFamily: "monospace",
    },
    copyButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.background.brandPrimary,
        marginBottom: spacing.md,
    },
    copyButtonText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.background.brandPrimary,
    },
    confirmButton: {
        backgroundColor: colors.background.brandPrimary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        paddingVertical: spacing.md,
        borderRadius: radius.lg,
        marginBottom: spacing.sm,
    },
    confirmButtonText: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.white,
    },
    waitingContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.xs,
        paddingVertical: spacing.md,
        backgroundColor: colors.background.tertiary,
        borderRadius: radius.lg,
        marginBottom: spacing.sm,
    },
    waitingText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    expiresText: {
        fontSize: typography.fontSize.xs,
        color: colors.text.tertiary,
        textAlign: "center",
    },
});
