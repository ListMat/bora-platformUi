"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function NotificationBell() {
    const [open, setOpen] = useState(false);

    const { data: unreadData } = trpc.notification.getUnreadCount.useQuery(undefined, {
        refetchInterval: 30000, // Atualizar a cada 30s
    });

    const { data, refetch } = trpc.notification.getMyNotifications.useQuery({
        limit: 10,
        skip: 0,
        unreadOnly: false,
    });

    const markAsReadMutation = trpc.notification.markAsRead.useMutation({
        onSuccess: () => {
            refetch();
        },
    });

    const markAllAsReadMutation = trpc.notification.markAllAsRead.useMutation({
        onSuccess: () => {
            refetch();
        },
    });

    const deleteNotificationMutation = trpc.notification.deleteNotification.useMutation({
        onSuccess: () => {
            refetch();
        },
    });

    const handleMarkAsRead = (notificationId: string) => {
        markAsReadMutation.mutate({ notificationId });
    };

    const handleMarkAllAsRead = () => {
        markAllAsReadMutation.mutate();
    };

    const handleDelete = (notificationId: string) => {
        deleteNotificationMutation.mutate({ notificationId });
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {(unreadData?.count ?? 0) > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadData?.count}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold">Notificações</h3>
                    {(data?.unreadCount ?? 0) > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="text-xs"
                        >
                            <CheckCheck className="h-4 w-4 mr-1" />
                            Marcar todas como lidas
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[400px]">
                    {data?.notifications && data.notifications.length > 0 ? (
                        <div className="divide-y">
                            {data.notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-accent transition-colors ${!notification.read ? "bg-blue-50 dark:bg-blue-950" : ""
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm mb-1">
                                                {notification.title}
                                            </h4>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(notification.createdAt), {
                                                    addSuffix: true,
                                                    locale: ptBR,
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex gap-1">
                                            {!notification.read && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleDelete(notification.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>Nenhuma notificação</p>
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
