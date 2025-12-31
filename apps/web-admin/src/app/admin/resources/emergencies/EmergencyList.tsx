"use client";

import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  BooleanField,
  useRecordContext,
} from "react-admin";
import { Badge } from "@/components/ui/badge";

const StatusField = () => {
  const record = useRecordContext();
  if (!record) return null;

  const metadata = record.metadata as any;
  const isResolved = metadata?.resolved === true;

  return (
    <Badge variant={isResolved ? "default" : "destructive"}>
      {isResolved ? "Resolvido" : "Pendente"}
    </Badge>
  );
};

const LocationField = () => {
  const record = useRecordContext();
  if (!record) return null;

  const metadata = record.metadata as any;
  const lat = metadata?.latitude;
  const lng = metadata?.longitude;

  if (!lat || !lng) return <span>-</span>;

  return (
    <a
      href={`https://www.google.com/maps?q=${lat},${lng}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      Ver no Mapa
    </a>
  );
};

export const EmergencyList = () => (
  <List
    perPage={25}
    sort={{ field: "createdAt", order: "DESC" }}
    filters={[]}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <DateField source="createdAt" label="Data/Hora" showTime />
      <FunctionField
        label="Usuário"
        render={(record: any) => record.user?.name || record.user?.email || "-"}
      />
      <StatusField label="Status" />
      <FunctionField
        label="Aula"
        render={(record: any) => {
          const metadata = record.metadata as any;
          return metadata?.lessonId ? `#${metadata.lessonId.substring(0, 8)}` : "-";
        }}
      />
      <LocationField label="Localização" />
      <FunctionField
        label="Descrição"
        render={(record: any) => {
          const metadata = record.metadata as any;
          return metadata?.description || "-";
        }}
      />
    </Datagrid>
  </List>
);

