import React from "react";
import { cn } from "@/lib/utils";

export function Table({ children, aria_label, className, ...props }: any) {
    return (
        <div className={cn("w-full overflow-auto rounded-xl border shadow-sm", className)}>
            <table className="w-full text-left text-sm" {...props}>
                {children}
            </table>
        </div>
    )
}

export function TableHeader({ children, columns }: any) {
    // HeroUI uses 'columns' prop or children
    if (columns && !children) {
        return (
            <thead className="bg-muted text-muted-foreground">
                <tr>
                    {columns.map((col: any) => (
                        <th key={col.uid || col.key} className="p-4 font-medium">{col.name}</th>
                    ))}
                </tr>
            </thead>
        );
    }
    return <thead className="bg-muted text-muted-foreground">{children}</thead>
}

export function TableColumn({ children, className }: any) {
    return <th className={cn("p-4 font-medium", className)}>{children}</th>
}

export function TableBody({ children, items, emptyContent, isLoading, loadingContent }: any) {
    if (isLoading) {
        return <tbody><tr><td colSpan={10} className="p-8 text-center">{loadingContent || "Carregando..."}</td></tr></tbody>;
    }
    if ((items && items.length === 0) || (!children && !items)) {
        return <tbody><tr><td colSpan={10} className="p-8 text-center text-muted-foreground">{emptyContent || "Sem dados."}</td></tr></tbody>;
    }

    if (items) {
        // Render prop pattern
        return <tbody>{items.map((item: any) => children(item))}</tbody>;
    }

    return <tbody>{children}</tbody>
}

export function TableRow({ children, key, className, ...props }: any) {
    return <tr key={key} className={cn("border-b hover:bg-muted/50 transition-colors", className)} {...props}>{children}</tr>
}

export function TableCell({ children, className }: any) {
    return <td className={cn("p-4 align-middle", className)}>{children}</td>
}
