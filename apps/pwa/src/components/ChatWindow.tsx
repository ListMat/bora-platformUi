'use client';

import { useEffect, useState, useRef } from 'react';
import { api } from '@/utils/api';
import { pusherClient } from '@/lib/pusher';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Send, User as UserIcon, Check, CheckCheck, MoreVertical, Phone, Video } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date; // Transformed from string by superjson
    isRead: boolean;
}

interface ChatWindowProps {
    lessonId: string;
    currentUserId: string;
    otherUserName: string;
    otherUserImage?: string | null;
    className?: string;
}

export default function ChatWindow({
    lessonId,
    currentUserId,
    otherUserName,
    otherUserImage,
    className
}: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Queries
    const { data: history, isLoading } = api.chat.listMessages.useQuery(
        { lessonId },
        {
            refetchOnWindowFocus: false,
            onSuccess: (data) => setMessages(data)
        }
    );

    // Mutations
    const sendMessageMutation = api.chat.sendMessage.useMutation({
        onSuccess: (message) => {
            setNewMessage('');
            // Optimistic update handled by pusher event, but we can append here too if we want immediate feedback
            // However, with Pusher, usually better to wait for event to avoid dupes 
            // OR use a temp ID. For simplicity, we wait for mutation success but rely on Pusher for the append to avoids double append logic
        },
        onError: (error) => {
            alert("Erro ao enviar mensagem: " + error.message);
        },
        onSettled: () => setIsSending(false)
    });

    const markAsReadMutation = api.chat.markAsRead.useMutation();

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Pusher Subscription
    useEffect(() => {
        const channel = pusherClient.subscribe(`lesson-${lessonId}`);

        channel.bind('new-message', (data: any) => {
            // Need to ensure data.createdAt is a Date object if coming from JSON
            const message: Message = {
                ...data,
                createdAt: new Date(data.createdAt),
                isRead: false
            };

            setMessages((prev) => {
                // Avoid duplicates
                if (prev.find(m => m.id === message.id)) return prev;
                return [...prev, message];
            });

            // Se a mensagem não é minha, marcar como lida
            if (message.senderId !== currentUserId) {
                // markAsReadMutation.mutate({ messageId: message.id });
                // TODO: Implementar lógica de visibilidade/foco para marcar como lida apenas se visto
            }
        });

        channel.bind('message-read', (data: { messageId: string }) => {
            setMessages((prev) => prev.map(msg =>
                msg.id === data.messageId ? { ...msg, isRead: true } : msg
            ));
        });

        return () => {
            pusherClient.unsubscribe(`lesson-${lessonId}`);
        };
    }, [lessonId, currentUserId]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        sendMessageMutation.mutate({
            lessonId,
            content: newMessage
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <Card className={`flex flex-col h-[600px] shadow-xl overflow-hidden ${className}`}>
            {/* Header */}
            <CardHeader className="p-4 border-b bg-primary/5 dark:bg-primary/10 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-background">
                        <AvatarImage src={otherUserImage || undefined} />
                        <AvatarFallback><UserIcon className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-sm">{otherUserName}</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-muted-foreground">Online agora</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30"
            >
                {/* Date separator example */}
                <div className="flex justify-center my-4">
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        Hoje
                    </span>
                </div>

                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2 opacity-50">
                        <div className="bg-muted p-4 rounded-full">
                            <Send className="h-6 w-6" />
                        </div>
                        <p className="text-sm">Nenhuma mensagem ainda</p>
                        <p className="text-xs">Comece a conversa!</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div
                            key={msg.id}
                            className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                                flex max-w-[80%] flex-col gap-1 
                                ${isMe ? 'items-end' : 'items-start'}
                            `}>
                                <div className={`
                                    px-4 py-2 rounded-2xl text-sm shadow-sm relative group
                                    ${isMe
                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                        : 'bg-card border text-card-foreground rounded-tl-none'
                                    }
                                `}>
                                    {msg.content}

                                    {/* Timestamp tooltip could go here */}
                                </div>
                                <div className="flex items-center gap-1 px-1">
                                    <span className="text-[10px] text-muted-foreground">
                                        {format(msg.createdAt, 'HH:mm')}
                                    </span>
                                    {isMe && (
                                        msg.isRead
                                            ? <CheckCheck className="h-3 w-3 text-blue-500" />
                                            : <Check className="h-3 w-3 text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer / Input */}
            <CardFooter className="p-3 bg-background border-t">
                <form
                    onSubmit={handleSend}
                    className="flex w-full items-center gap-2"
                >
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-muted-foreground hover:text-primary transition-colors"
                    >
                        {/* Attachment icon */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                    </Button>

                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background transition-all"
                        disabled={isSending}
                    />

                    <Button
                        type="submit"
                        size="icon"
                        disabled={!newMessage.trim() || isSending}
                        className={`
                            h-10 w-10 transition-all duration-200
                            ${newMessage.trim() ? 'scale-100 opacity-100' : 'scale-90 opacity-70'}
                        `}
                    >
                        {isSending ? (
                            <Spinner className="h-4 w-4 text-primary-foreground" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
