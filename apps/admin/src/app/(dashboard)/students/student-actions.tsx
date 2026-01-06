"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Wallet, History } from "lucide-react";
import { Student } from "./columns";
import { AddBalanceDialog } from "@/components/add-balance-dialog";

interface StudentActionsProps {
    student: Student;
}

export function StudentActions({ student }: StudentActionsProps) {
    const [openBalanceDialog, setOpenBalanceDialog] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(student.id)}
                    >
                        Copiar ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenBalanceDialog(true)}>
                        <Wallet className="mr-2 h-4 w-4" />
                        Gerenciar Saldo
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                        <History className="mr-2 h-4 w-4" />
                        Ver Histórico (Em breve)
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AddBalanceDialog
                open={openBalanceDialog}
                onOpenChange={setOpenBalanceDialog}
                studentId={student.id}
                studentName={student.user.name || "Aluno"} // Ajuste aqui para pegar user.name
                onSuccess={() => setOpenBalanceDialog(false)}
            />
        </>
    );
}
