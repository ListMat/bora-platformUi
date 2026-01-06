'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Activity {
    id: string;
    type: string;
    user: {
        name: string;
        image?: string;
    };
    description: string;
    createdAt: Date;
}

interface RecentActivityProps {
    activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
    return (
        <div className="space-y-8">
            {activities.map((activity) => (
                <div key={activity.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={activity.user.image} alt={activity.user.name} />
                        <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1 flex-1">
                        <p className="text-sm font-medium leading-none">
                            {activity.user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {activity.description}
                        </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                        })}
                    </div>
                </div>
            ))}
            {activities.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma atividade recente
                </p>
            )}
        </div>
    );
}
