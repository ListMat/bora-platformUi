"use client";

import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  FunctionField,
  useRecordContext,
  useNotify,
  useRefresh,
} from "react-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

const EmergencyDetails = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [resolution, setResolution] = useState("");
  const [isResolving, setIsResolving] = useState(false);

  const resolveMutation = trpc.emergency.resolve.useMutation({
    onSuccess: () => {
      notify("Emergência resolvida com sucesso", { type: "success" });
      refresh();
    },
    onError: (error) => {
      notify(`Erro: ${error.message}`, { type: "error" });
    },
  });

  if (!record) return null;

  const metadata = record.metadata as any;
  const isResolved = metadata?.resolved === true;

  const handleResolve = async () => {
    if (!resolution.trim()) {
      notify("Por favor, descreva a resolução", { type: "warning" });
      return;
    }

    setIsResolving(true);
    try {
      await resolveMutation.mutateAsync({
        emergencyId: record.id,
        resolution: resolution.trim(),
      });
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Detalhes da Emergência</span>
            <Badge variant={isResolved ? "default" : "destructive"}>
              {isResolved ? "Resolvido" : "Pendente"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-sm font-medium">Usuário:</span>
            <p className="text-sm text-muted-foreground">
              {record.user?.name || record.user?.email || "-"}
            </p>
          </div>

          <div>
            <span className="text-sm font-medium">Data/Hora:</span>
            <p className="text-sm text-muted-foreground">
              {new Date(record.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>

          <div>
            <span className="text-sm font-medium">Aula ID:</span>
            <p className="text-sm text-muted-foreground">
              {metadata?.lessonId || "-"}
            </p>
          </div>

          <div>
            <span className="text-sm font-medium">Descrição:</span>
            <p className="text-sm text-muted-foreground">
              {metadata?.description || "-"}
            </p>
          </div>

          <div>
            <span className="text-sm font-medium">Localização:</span>
            <p className="text-sm text-muted-foreground">
              {metadata?.latitude && metadata?.longitude ? (
                <a
                  href={`https://www.google.com/maps?q=${metadata.latitude},${metadata.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {metadata.latitude.toFixed(6)}, {metadata.longitude.toFixed(6)} (Ver no Mapa)
                </a>
              ) : (
                "-"
              )}
            </p>
          </div>

          {isResolved && (
            <>
              <div>
                <span className="text-sm font-medium">Resolvido em:</span>
                <p className="text-sm text-muted-foreground">
                  {new Date(metadata.resolvedAt).toLocaleString("pt-BR")}
                </p>
              </div>

              <div>
                <span className="text-sm font-medium">Resolvido por:</span>
                <p className="text-sm text-muted-foreground">
                  {metadata.resolvedBy || "-"}
                </p>
              </div>

              <div>
                <span className="text-sm font-medium">Resolução:</span>
                <p className="text-sm text-muted-foreground">
                  {metadata.resolution || "-"}
                </p>
              </div>
            </>
          )}

          {!isResolved && (
            <div className="space-y-2 pt-4 border-t">
              <span className="text-sm font-medium">Resolver Emergência:</span>
              <Textarea
                placeholder="Descreva como a emergência foi resolvida..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
              />
              <Button
                onClick={handleResolve}
                disabled={isResolving || !resolution.trim()}
                className="w-full"
              >
                {isResolving ? "Resolvendo..." : "Marcar como Resolvido"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const EmergencyShow = () => (
  <Show>
    <SimpleShowLayout>
      <EmergencyDetails />
    </SimpleShowLayout>
  </Show>
);

