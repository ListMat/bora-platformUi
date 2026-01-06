import { cn } from "@/lib/utils"

export function Accordion({ children, className }: any) {
    return <div className={cn("space-y-2", className)}>{children}</div>
}

export function AccordionItem({ title, subtitle, startContent, children, className, key }: any) {
    return (
        <div key={key} className={cn("border rounded-lg shadow-sm bg-card text-card-foreground", className)}>
            <button className="w-full p-4 font-medium flex items-center justify-between hover:bg-muted/50 transition-colors text-left">
                <div className="flex items-center gap-3">
                    {startContent}
                    <div>
                        <div>{title}</div>
                        {subtitle && <div className="text-sm text-muted-foreground font-normal">{subtitle}</div>}
                    </div>
                </div>
                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="p-4 pt-0 border-t-0 text-foreground-muted">
                {children}
            </div>
        </div>
    )
}
