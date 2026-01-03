import React, { useEffect, useRef, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
    Animated,
    PanResponder,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, spacing, typography } from '@/theme';
import { trpc } from '@/lib/trpc';

const { width, height } = Dimensions.get('window');

interface InstructorDetailModalProps {
    visible: boolean;
    onClose: () => void;
    instructor: any;
}

export function InstructorDetailModal({
    visible,
    onClose,
    instructor,
}: InstructorDetailModalProps) {
    const router = useRouter();
    const panY = useRef(new Animated.Value(0)).current;

    // Estados de seleção
    const [selectedPackage, setSelectedPackage] = React.useState<string | null>(null);
    const [selectedSchedule, setSelectedSchedule] = React.useState<string | null>(null);
    const [selectedDayId, setSelectedDayId] = React.useState<string | null>(null);

    // Buscar pacotes disponíveis do backend
    const { data: plans, isLoading: loadingPlans } = trpc.plan.list.useQuery({ instructorId: instructor?.id });

    // Buscar horários disponíveis
    const { data: availabilitySchedule, isLoading: loadingSchedule } = trpc.availability.getByInstructorId.useQuery(
        { instructorId: instructor?.id },
        { enabled: !!instructor?.id }
    );

    // Gerar próximos 14 dias
    const nextDays = useMemo(() => {
        const days = [];
        const today = new Date();
        const ptBRDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dayOfWeek = date.getDay();
            days.push({
                id: i.toString(),
                dateObj: date,
                dayOfWeek,
                // Formatação fail-safe para Android
                label: ptBRDays[dayOfWeek],
                dateString: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`,
            });
        }
        return days;
    }, []);

    // Reset animation when opening
    useEffect(() => {
        if (visible) {
            panY.setValue(0);
        }
    }, [visible]);

    // Pan responder to close on swipe down
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    panY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 100) {
                    onClose();
                } else {
                    Animated.spring(panY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    if (!instructor) return null;

    const vehicle = instructor.vehicles?.[0];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} onPress={onClose} />

                <Animated.View
                    style={[
                        styles.container,
                        { transform: [{ translateY: panY }] }
                    ]}
                    {...panResponder.panHandlers}
                >
                    {/* Handle bar */}
                    <View style={styles.handleContainer}>
                        <View style={styles.handle} />
                    </View>

                    {/* Close button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={20} color={colors.text.secondary} />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                        {/* Header: Avatar + Info */}
                        <View style={styles.header}>
                            {instructor.user.image ? (
                                <Image
                                    source={{ uri: instructor.user.image }}
                                    style={styles.avatar}
                                />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Ionicons name="person" size={32} color={colors.text.tertiary} />
                                </View>
                            )}

                            <View style={styles.headerInfo}>
                                <View style={styles.nameRow}>
                                    <Text style={styles.name}>{instructor.user.name}</Text>
                                    {instructor.user.emailVerified && (
                                        <Ionicons name="checkmark-circle" size={16} color="#3B82F6" style={{ marginLeft: 4 }} />
                                    )}
                                </View>

                                <View style={styles.ratingRow}>
                                    <Ionicons name="star" size={14} color="#FFD700" />
                                    <Text style={styles.rating}>
                                        {instructor.averageRating?.toFixed(1) || '5.0'} ({instructor.totalLessons || 42})
                                    </Text>
                                    <View style={styles.credentialBadge}>
                                        <Text style={styles.credentialText}>Credencial</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.priceBox}>
                                <Text style={styles.priceLabel}>Valor Por Aula</Text>
                                <Text style={styles.priceValue}>
                                    R$ {Number(instructor.basePrice).toFixed(0)}<Text style={styles.perHour}>/hora</Text>
                                </Text>
                            </View>
                        </View>

                        {/* Tags (Tipo de Aula) */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Tipo de Aula – Instrutor</Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>1ª habilitação</Text>
                            </View>
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>Aula noturna</Text>
                            </View>
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>Manobras / Baliza</Text>
                            </View>
                        </ScrollView>

                        <View style={styles.divider} />

                        {/* Pacotes Disponíveis */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Pacotes Disponíveis</Text>
                            <Text style={styles.sectionSubtitle}>Selecione um pacote para continuar</Text>
                        </View>

                        {/* Lista de Pacotes */}
                        <View style={styles.packagesContainer}>
                            {loadingPlans ? (
                                <View style={{ padding: 20, alignItems: 'center' }}><ActivityIndicator color="#EAB308" /></View>
                            ) : plans?.map((pkg) => {
                                const tag = pkg.discount > 0 ? `-${pkg.discount}%` : null;
                                return (
                                    <TouchableOpacity
                                        key={pkg.id}
                                        style={[
                                            styles.packageCard,
                                            selectedPackage === pkg.id && styles.packageCardSelected
                                        ]}
                                        onPress={() => setSelectedPackage(pkg.id)}
                                    >
                                        {tag && (
                                            <View style={styles.packageTag}>
                                                <Text style={styles.packageTagText}>{tag}</Text>
                                            </View>
                                        )}

                                        <View style={styles.packageHeader}>
                                            <View style={styles.packageLessons}>
                                                <Text style={styles.packageLessonsNumber}>{pkg.lessons}</Text>
                                                <Text style={styles.packageLessonsText}>aula{pkg.lessons > 1 ? 's' : ''}</Text>
                                            </View>

                                            {selectedPackage === pkg.id && (
                                                <View style={styles.selectedBadge}>
                                                    <Ionicons name="checkmark-circle" size={24} color="#EAB308" />
                                                </View>
                                            )}
                                        </View>

                                        <View style={styles.packagePricing}>
                                            {pkg.originalPrice && Number(pkg.originalPrice) > Number(pkg.price) && (
                                                <Text style={styles.packageOriginalPrice}>
                                                    R$ {Number(pkg.originalPrice)}
                                                </Text>
                                            )}
                                            <Text style={styles.packagePrice}>R$ {pkg.price}</Text>
                                            <Text style={styles.packagePricePerLesson}>
                                                R$ {(pkg.price / pkg.lessons).toFixed(0)}/aula
                                            </Text>
                                        </View>

                                        {pkg.lessons >= 5 && (
                                            <View style={styles.packageBenefit}>
                                                <Ionicons name="gift-outline" size={16} color="#34D399" />
                                                <Text style={styles.packageBenefitText}>
                                                    {pkg.lessons === 5 ? '1 aula extra grátis' : '2 aulas extras grátis'}
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View style={styles.divider} />

                        {/* Horários Disponíveis */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Horários Disponíveis</Text>
                            <Text style={styles.sectionSubtitle}>Escolha o melhor horário para você</Text>
                        </View>

                        {/* Dias da Semana */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
                            {loadingSchedule ? (
                                <ActivityIndicator style={{ marginLeft: 20 }} color="#EAB308" />
                            ) : nextDays.map((day) => {
                                const dayConfig = availabilitySchedule?.find(s => s.dayOfWeek === day.dayOfWeek);
                                const isAvailable = dayConfig ? (dayConfig.morning || dayConfig.afternoon || dayConfig.evening) : false;
                                const isSelected = selectedDayId === day.id;

                                return (
                                    <TouchableOpacity
                                        key={day.id}
                                        style={[
                                            styles.dayCard,
                                            !isAvailable && styles.dayCardDisabled,
                                            isSelected && styles.dayCardSelected
                                        ]}
                                        disabled={!isAvailable}
                                        onPress={() => {
                                            if (isSelected) {
                                                setSelectedDayId(null);
                                                setSelectedSchedule(null);
                                            } else {
                                                setSelectedDayId(day.id);
                                                setSelectedSchedule(null);
                                            }
                                        }}
                                    >
                                        <Text style={[
                                            styles.dayLabel,
                                            !isAvailable && styles.dayLabelDisabled,
                                            isSelected && styles.dayLabelSelected
                                        ]}>
                                            {day.label}
                                        </Text>
                                        <Text style={[
                                            styles.dayDate,
                                            !isAvailable && styles.dayDateDisabled,
                                            isSelected && styles.dayDateSelected
                                        ]}>
                                            {day.dateString}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        {/* Slots de Horário Dinâmicos */}
                        {selectedDayId && (
                            <View style={styles.timeSlotsContainer}>
                                <Text style={styles.timeSlotsTitle}>Selecione o turno:</Text>
                                <View style={styles.timeSlots}>
                                    {(() => {
                                        const dayObj = nextDays.find(d => d.id === selectedDayId);
                                        const dayConfig = availabilitySchedule?.find(s => s.dayOfWeek === dayObj?.dayOfWeek);

                                        const slots = [
                                            { id: 'morning', label: 'Manhã', time: '08:00 - 12:00', available: dayConfig?.morning },
                                            { id: 'afternoon', label: 'Tarde', time: '13:00 - 17:00', available: dayConfig?.afternoon },
                                            { id: 'evening', label: 'Noite', time: '18:00 - 22:00', available: dayConfig?.evening },
                                        ];

                                        return slots.map((slot) => {
                                            const currentSelectionId = `${selectedDayId}-${slot.id}`;
                                            const isSelected = selectedSchedule === currentSelectionId;

                                            return (
                                                <TouchableOpacity
                                                    key={slot.id}
                                                    style={[
                                                        styles.timeSlot,
                                                        !slot.available && styles.timeSlotDisabled,
                                                        isSelected && styles.timeSlotSelected
                                                    ]}
                                                    disabled={!slot.available}
                                                    onPress={() => setSelectedSchedule(currentSelectionId)}
                                                >
                                                    <View style={styles.timeSlotHeader}>
                                                        <Text style={[
                                                            styles.timeSlotLabel,
                                                            !slot.available && styles.timeSlotLabelDisabled,
                                                            isSelected && styles.timeSlotLabelSelected
                                                        ]}>
                                                            {slot.label}
                                                        </Text>
                                                        {!slot.available && (
                                                            <View style={styles.slotBadge}>
                                                                <Text style={styles.slotBadgeText}>Indisponível</Text>
                                                            </View>
                                                        )}
                                                        {isSelected && (
                                                            <Ionicons name="checkmark-circle" size={20} color="#EAB308" />
                                                        )}
                                                    </View>
                                                    <Text style={[
                                                        styles.timeSlotTime,
                                                        !slot.available && styles.timeSlotTimeDisabled,
                                                        isSelected && styles.timeSlotTimeSelected
                                                    ]}>
                                                        {slot.time}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })()
                                    }
                                </View>
                            </View>
                        )}

                        <View style={styles.divider} />

                        {/* Localização */}
                        <TouchableOpacity style={styles.rowButton}>
                            <Ionicons name="location-outline" size={24} color={colors.text.primary} />
                            <Text style={styles.rowText} numberOfLines={1}>
                                {instructor.city || 'Belo Horizonte'}, {instructor.state || 'MG'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        {/* Veículo */}
                        <View style={styles.vehicleSection}>
                            <Text style={styles.sectionTitle}>Veículo para aula</Text>

                            <View style={styles.vehicleTags}>
                                <View style={styles.vehicleTag}>
                                    <Text style={styles.vehicleTagText}>Sedan</Text>
                                </View>
                                <View style={styles.vehicleTag}>
                                    <Text style={styles.vehicleTagText}>Manual</Text>
                                </View>
                                <View style={styles.vehicleTag}>
                                    <View style={[styles.colorDot, { backgroundColor: '#F5F5F6' }]} />
                                    <Text style={styles.vehicleTagText}>Branco Polar</Text>
                                </View>
                                <View style={styles.vehicleTag}>
                                    <Text style={styles.vehicleTagText}>2.0 flex · 177 cv</Text>
                                </View>
                            </View>

                            {vehicle && (
                                <View style={styles.vehicleDisplay}>
                                    {/* Foto grande do carro */}
                                    <Image
                                        source={{ uri: vehicle.photoUrl || 'https://via.placeholder.com/300x150' }}
                                        style={styles.vehicleImageLarge}
                                        resizeMode="contain"
                                    />

                                    <View style={styles.vehicleOverlayInfo}>
                                        <Text style={styles.vehicleOverlayBrand}>{vehicle.brand || 'Porsche'} {vehicle.model || 'Carera 911'}</Text>
                                        <Text style={styles.vehicleOverlayPlate}>{vehicle.plateLast4 ? `PLACA ${vehicle.plateLast4}` : 'TXN-7E55'}</Text>

                                        <View style={styles.pedalBadge}>
                                            <Text style={styles.pedalBadgeText}>Duplo-pedal instalado</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Check - Carro aceito */}
                        <View style={styles.checkRow}>
                            <Ionicons name="checkmark-circle-outline" size={24} color={colors.background.brandPrimary} />
                            <Text style={styles.checkText}>Carro do aluno aceito</Text>
                        </View>

                        {/* Espaço extra para o botão fixo */}
                        <View style={{ height: 100 }} />

                    </ScrollView>

                    {/* Botão Fixo Bottom */}
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity
                            style={[
                                styles.mainButton,
                                (!selectedPackage || !selectedSchedule) && styles.mainButtonDisabled
                            ]}
                            disabled={!selectedPackage || !selectedSchedule}
                            onPress={() => {
                                if (!selectedPackage || !selectedSchedule) return;
                                onClose();
                                router.push({
                                    pathname: "/screens/LessonCheckout",
                                    params: {
                                        instructorId: instructor.id,
                                        packageId: selectedPackage,
                                        scheduleId: selectedSchedule,
                                    },
                                });
                            }}
                        >
                            <Text style={[
                                styles.mainButtonText,
                                (!selectedPackage || !selectedSchedule) && styles.mainButtonTextDisabled
                            ]}>
                                {!selectedPackage
                                    ? 'Selecione um pacote'
                                    : !selectedSchedule
                                        ? 'Selecione um horário'
                                        : 'Solicitar Aula'}
                            </Text>
                            {selectedPackage && selectedSchedule && (
                                <Ionicons name="car-sport-outline" size={24} color="#000" />
                            )}
                        </TouchableOpacity>
                    </View>

                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        backgroundColor: '#030712', // Dark bg
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        height: '85%', // Ocupa quase a tela toda
        paddingTop: spacing.md,
    },
    handleContainer: {
        alignItems: 'center',
        paddingBottom: spacing.md,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#374151',
        borderRadius: 2,
    },
    closeButton: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        padding: spacing.sm,
        backgroundColor: '#1F2937',
        borderRadius: radius.full,
        zIndex: 10,
    },
    content: {
        paddingHorizontal: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: '#3B82F6', // Blue border com check
    },
    avatarPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#374151',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F9FAFB',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    rating: {
        color: '#9CA3AF',
        marginLeft: 4,
        marginRight: 8,
    },
    credentialBadge: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.4)',
    },
    credentialText: {
        color: '#60A5FA',
        fontSize: 10,
        fontWeight: '600',
    },
    priceBox: {
        alignItems: 'flex-end',
    },
    priceLabel: {
        color: '#9CA3AF',
        fontSize: 12,
    },
    priceValue: {
        color: '#F9FAFB',
        fontSize: 20,
        fontWeight: 'bold',
    },
    perHour: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#9CA3AF',
    },
    sectionHeader: {
        marginTop: spacing.md,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#D1D5DB',
    },
    tagsScroll: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
    },
    tag: {
        backgroundColor: '#1F2937',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#374151',
    },
    tagText: {
        color: '#D1D5DB',
    },
    divider: {
        height: 1,
        backgroundColor: '#1F2937',
        marginVertical: spacing.md,
    },
    rowButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    rowText: {
        flex: 1,
        color: '#F9FAFB',
        fontSize: 16,
        marginLeft: spacing.lg,
    },
    vehicleSection: {
        marginTop: spacing.lg,
    },
    vehicleTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
    vehicleTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F2937',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#374151',
    },
    vehicleTagText: {
        color: '#D1D5DB',
        fontSize: 12,
    },
    colorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    vehicleDisplay: {
        position: 'relative',
        height: 180,
        marginBottom: spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vehicleImageLarge: {
        width: '100%',
        height: '100%',
    },
    vehicleOverlayInfo: {
        position: 'absolute',
        right: 0,
        top: 20,
        alignItems: 'flex-end',
    },
    vehicleOverlayBrand: {
        color: '#F9FAFB',
        fontSize: 14,
        fontWeight: 'bold',
    },
    vehicleOverlayPlate: {
        color: '#9CA3AF',
        fontSize: 12,
        marginBottom: 4,
    },
    pedalBadge: {
        backgroundColor: 'rgba(5, 150, 105, 0.2)', // Emerald bg
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(5, 150, 105, 0.4)',
    },
    pedalBadgeText: {
        color: '#34D399',
        fontSize: 10,
        fontWeight: '600',
    },
    checkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    checkText: {
        color: '#F9FAFB',
        marginLeft: spacing.md,
        fontSize: 16,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.xl,
        paddingBottom: spacing['4xl'],
        backgroundColor: '#030712', // Ensure background covers scrolling content
        borderTopWidth: 1,
        borderTopColor: '#1F2937',
    },
    mainButton: {
        backgroundColor: '#EAB308', // Yellow
        paddingVertical: 16,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    mainButtonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    mainButtonDisabled: {
        backgroundColor: '#374151',
        opacity: 0.6,
    },
    mainButtonTextDisabled: {
        color: '#9CA3AF',
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 4,
    },
    packagesContainer: {
        gap: 12,
        marginVertical: spacing.md,
    },
    packageCard: {
        backgroundColor: '#1F2937',
        borderRadius: 16,
        padding: spacing.lg,
        borderWidth: 2,
        borderColor: '#374151',
        position: 'relative',
    },
    packageCardSelected: {
        borderColor: '#EAB308',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
    },
    packageTag: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#059669',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    packageTagText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    packageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    packageLessons: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    packageLessonsNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#F9FAFB',
    },
    packageLessonsText: {
        fontSize: 16,
        color: '#9CA3AF',
    },
    selectedBadge: {},
    packagePricing: {
        marginBottom: spacing.sm,
    },
    packageOriginalPrice: {
        fontSize: 14,
        color: '#6B7280',
        textDecorationLine: 'line-through',
        marginBottom: 2,
    },
    packagePrice: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F9FAFB',
        marginBottom: 2,
    },
    packagePricePerLesson: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    packageBenefit: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: spacing.sm,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: '#374151',
    },
    packageBenefitText: {
        fontSize: 13,
        color: '#34D399',
        fontWeight: '500',
    },
    // Schedule Section
    daysScroll: {
        marginVertical: spacing.md,
    },
    dayCard: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        padding: spacing.md,
        marginRight: spacing.sm,
        minWidth: 70,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#374151',
    },
    dayCardDisabled: {
        opacity: 0.4,
        backgroundColor: '#111827',
    },
    dayCardSelected: {
        borderColor: '#EAB308',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
    },
    dayLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#D1D5DB',
        marginBottom: 4,
    },
    dayLabelDisabled: {
        color: '#6B7280',
    },
    dayLabelSelected: {
        color: '#EAB308',
    },
    dayDate: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    dayDateDisabled: {
        color: '#4B5563',
    },
    dayDateSelected: {
        color: '#EAB308',
    },
    timeSlotsContainer: {
        marginTop: spacing.lg,
    },
    timeSlotsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#D1D5DB',
        marginBottom: spacing.md,
    },
    timeSlots: {
        gap: spacing.sm,
    },
    timeSlot: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        padding: spacing.lg,
        borderWidth: 2,
        borderColor: '#374151',
    },
    timeSlotDisabled: {
        opacity: 0.5,
        backgroundColor: '#111827',
    },
    timeSlotSelected: {
        borderColor: '#EAB308',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
    },
    timeSlotHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    timeSlotLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#F9FAFB',
    },
    timeSlotLabelDisabled: {
        color: '#6B7280',
    },
    timeSlotLabelSelected: {
        color: '#EAB308',
    },
    timeSlotTime: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    timeSlotTimeDisabled: {
        color: '#4B5563',
    },
    timeSlotTimeSelected: {
        color: '#D1D5DB',
    },
    slotBadge: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    slotBadgeText: {
        color: '#EF4444',
        fontSize: 11,
        fontWeight: '600',
    },
});
