"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AddBalanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    studentId: string;
    studentName: string;
    onSuccess: () => void;
}

export function AddBalanceDialog({ open, onOpenChange, studentId, studentName, onSuccess }: AddBalanceDialogProps) {
    const { toast } = useToast();
    const [amount, setAmount] = useState<string>("");
    const [type, setType] = useState<"DEPOSIT" | "WITHDRAW" | "BONUS">("DEPOSIT");
    const [description, setDescription] = useState<string>("");

    const utils = api.useContext();
    const mutation = api.admin.addBalance.useMutation({
        onSuccess: () => {
            toast({
                title: "Saldo atualizado",
                description: `A transação de ${type} foi realizada com sucesso.`,
            });
            utils.admin.getStudents.invalidate();
            if (onSuccess) onSuccess();
            onOpenChange(false);
            setAmount("");
            setDescription("");
        },
        onError: (error) => {
            toast({
                title: "Erro",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount.replace(",", "."));
        if (isNaN(numericAmount) || numericAmount <= 0) {
            toast({ title: "Valor inválido", variant: "destructive" });
            return;
        }

        // Se for withdraw, mandamos positivo para a API, mas a API deveria tratar subtrair?
        // No meu backend codei: newBalance = oldBalance + input.amount;
        // Então se for WITHDRAW, tenho que mandar NEGATIVO.

        let finalAmount = numericAmount;
        if (type === "WITHDRAW") {
            finalAmount = -numericAmount;
        }

        mutation.mutate({
            studentId,
            amount: finalAmount,
            type,
            description: description || `Transação manual de ${type}`,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Gerenciar Saldo</DialogTitle>
                    <DialogDescription>
                        Ajuste o saldo da carteira de <b>{studentName}</b>.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Tipo de Transação</Label>
                        <Select value={type} onValueChange={(v: any) => setType(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DEPOSIT">Depósito (Adicionar)</SelectItem>
                                <SelectItem value="BONUS">Bônus (Adicionar)</SelectItem>
                                <SelectItem value="WITHDRAW">Saque / Correção (Remover)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Valor (R$)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Descrição (Opcional)</Label>
                        <Input
                            placeholder="Ex: Reembolso aula cancelada"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={mutation.isLoading}>
                            {mutation.isLoading ? "Processando..." : "Confirmar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
