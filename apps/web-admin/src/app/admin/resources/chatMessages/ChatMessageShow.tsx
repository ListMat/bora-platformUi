import { Show } from "@/components/show";
import { SimpleShowLayout } from "@/components/simple-show-layout";
import { TextField } from "@/components/text-field";
import { DateField } from "@/components/date-field";
import { BooleanField } from "@/components/boolean-field";
import { BadgeField } from "@/components/badge-field";
import { ImageField } from "@/components/image-field";
import { NumberField } from "@/components/number-field";

export const ChatMessageShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <div className="grid grid-cols-2 gap-4">
          <TextField source="lesson.id" label="ID da Aula" />
          <TextField source="sender.name" label="Remetente" />
          <TextField source="sender.email" label="E-mail do Remetente" />
        </div>

        <TextField source="content" label="Conteúdo" />

        <div className="grid grid-cols-2 gap-4">
          <BadgeField source="messageType" label="Tipo de Mensagem" />
          <BooleanField source="isRead" label="Lida" />
        </div>

        <ImageField source="mediaUrl" label="Mídia (Foto/Áudio)" />

        <NumberField source="mediaDuration" label="Duração do Áudio (segundos)" />

        <div className="grid grid-cols-2 gap-4">
          <DateField source="createdAt" label="Enviada em" showTime />
          <DateField source="readAt" label="Lida em" showTime />
        </div>
      </SimpleShowLayout>
    </Show>
  );
};

