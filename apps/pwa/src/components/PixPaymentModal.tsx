'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/chip";
import { Spinner } from "@/components/ui/spinner";
import { api } from '@/utils/api';
import {
    Copy,
    Check,
    QrCode,
    Clock,
    AlertCircle,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { formatPrice } from '@/lib/validations/onboarding';

interface PixPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    lessonId: string;
    amount: number;
    description: string;
    onSuccess?: () => void;
}

export default function PixPaymentModal({
    isOpen,
    onClose,
    lessonId,
    amount,
    description,
    onSuccess,
}: PixPaymentModalProps) {
    const [copied, setCopied] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [paymentId, setPaymentId] = useState<string>('');

    const createPaymentMutation = api.mercadopago.createPixPayment.useMutation({
        onSuccess: (data) => {
            setPaymentId(data.id);
        },
        onError: (error) => {
            alert('Erro ao gerar pagamento: ' + error.message);
        },
    });

    const { data: payment } = createPaymentMutation.data ?
        { data: createPaymentMutation.data } :
        { data: null };

    // Polling para verificar status do pagamento
    useEffect(() => {
        if (!paymentId) return;

        const interval = setInterval(async () => {
            try {
                const status = await api.mercadopago.getPaymentStatus.useQuery(
                    { paymentId },
                    { enabled: !!paymentId }
                );

                if (status.data?.status === 'approved') {
                    setPaymentStatus('approved');
                    clearInterval(interval);
                    setTimeout(() => {
                        onSuccess?.();
                        onClose();
                    }, 2000);
                } else if (status.data?.status === 'rejected') {
                    setPaymentStatus('rejected');
                    clearInterval(interval);
                }
            } catch (error) {
                console.error('Erro ao verificar status:', error);
            }
        }, 3000); // Verifica a cada 3 segundos

        return () => clearInterval(interval);
    }, [paymentId, onSuccess, onClose]);

    // Criar pagamento ao abrir modal
    useEffect(() => {
        if (isOpen && !payment) {
            createPaymentMutation.mutate({
                lessonId,
                amount,
                description,
            });
        }
    }, [isOpen]);

    const handleCopyPixCode = () => {
        if (payment?.qrCode) {
            navigator.clipboard.writeText(payment.qrCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleClose = () => {
        setPaymentStatus('pending');
        setPaymentId('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center">
                        Pagamento via Pix
                    </DialogTitle>
                </DialogHeader>

                {createPaymentMutation.isPending ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Spinner size="lg" className="mb-4" />
                        <p className="text-muted-foreground">Gerando QR Code...</p>
                    </div>
                ) : paymentStatus === 'approved' ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Pagamento Aprovado!</h3>
                        <p className="text-muted-foreground">
                            Sua aula foi confirmada. Redirecionando...
                        </p>
                    </div>
                ) : paymentStatus === 'rejected' ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
                            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Pagamento Recusado</h3>
                        <p className="text-muted-foreground mb-4">
                            Houve um problema com o pagamento. Tente novamente.
                        </p>
                        <Button onClick={handleClose}>Fechar</Button>
                    </div>
                ) : payment ? (
                    <div className="space-y-6">
                        {/* Valor */}
                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="p-6 text-center">
                                <p className="text-sm text-muted-foreground mb-1">Valor a pagar</p>
                                <p className="text-4xl font-bold text-primary">
                                    {formatPrice(amount)}
                                </p>
                            </CardContent>
                        </Card>

                        {/* QR Code */}
                        {payment.qrCodeBase64 && (
                            <div className="flex flex-col items-center">
                                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                                    <img
                                        src={`data:image/png;base64,${payment.qrCodeBase64}`}
                                        alt="QR Code Pix"
                                        className="w-64 h-64"
                                    />
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <QrCode className="w-4 h-4" />
                                    <span>Escaneie com o app do seu banco</span>
                                </div>
                            </div>
                        )}

                        {/* Código Pix Copia e Cola */}
                        {payment.qrCode && (
                            <div>
                                <p className="text-sm font-medium mb-2 text-center">
                                    Ou copie o código Pix:
                                </p>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-muted rounded-lg p-3 overflow-hidden">
                                        <code className="text-xs break-all">
                                            {payment.qrCode}
                                        </code>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleCopyPixCode}
                                        className="flex-shrink-0"
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Status */}
                        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                                            Aguardando pagamento
                                        </p>
                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                            O pagamento será confirmado automaticamente após a aprovação.
                                            Isso pode levar alguns segundos.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informações */}
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>O QR Code expira em 30 minutos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Pagamento seguro via Mercado Pago</span>
                            </div>
                        </div>

                        {/* Botão Cancelar */}
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="w-full"
                        >
                            Cancelar
                        </Button>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
