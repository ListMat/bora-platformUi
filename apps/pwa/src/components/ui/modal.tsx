import * as React from "react";
import { cn } from "@/lib/utils";

export function Modal({ isOpen, onOpenChange, children, size, ...props }: any) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className={cn("bg-background rounded-lg shadow-lg w-full relative max-h-[90vh] overflow-auto animate-in fade-in zoom-in-95 duration-200", size === "full" ? "h-full max-w-none" : "max-w-lg")}>
                <button onClick={() => onOpenChange(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                {children}
            </div>
        </div>
    )
}

export function ModalContent({ children }: any) { return <div className="flex flex-col h-full">{children}</div> }

export function ModalHeader({ children, className }: any) { return <div className={cn("p-6 pb-2 text-xl font-bold", className)}>{children}</div> }

export function ModalBody({ children, className }: any) { return <div className={cn("p-6 py-4 flex-1 overflow-auto", className)}>{children}</div> }

export function ModalFooter({ children, className }: any) { return <div className={cn("p-6 pt-2 flex justify-end gap-2", className)}>{children}</div> }

export function useDisclosure() {
    const [isOpen, setIsOpen] = React.useState(false);
    return { isOpen, onOpen: () => setIsOpen(true), onOpenChange: setIsOpen, onClose: () => setIsOpen(false) }
}
