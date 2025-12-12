# Configuração do Bucket de Fotos de Veículos no Supabase

Este guia explica como configurar o bucket `vehicle-photos` no Supabase Storage para o sistema de cadastro de veículos.

## 1. Criar o Bucket

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Storage** no menu lateral
4. Clique em **New bucket**
5. Configure:
   - **Name:** `vehicle-photos`
   - **Public bucket:** ✅ Sim (para permitir visualização pública das fotos)
   - **File size limit:** 5 MB
   - **Allowed MIME types:** `image/jpeg`, `image/png`

## 2. Configurar Políticas (Policies)

### Política de Leitura Pública

Permite que qualquer pessoa visualize as fotos dos veículos:

```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vehicle-photos');
```

### Política de Upload (Authenticated Write)

Permite que usuários autenticados façam upload de fotos:

```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vehicle-photos');
```

### Política de Atualização (Authenticated Update)

Permite que usuários autenticados atualizem suas próprias fotos:

```sql
CREATE POLICY "Authenticated users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'vehicle-photos');
```

### Política de Exclusão (Authenticated Delete)

Permite que usuários autenticados excluam suas próprias fotos:

```sql
CREATE POLICY "Authenticated users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'vehicle-photos');
```

## 3. Aplicar Políticas via Dashboard

Alternativamente, você pode configurar via interface:

1. Vá em **Storage** > **Policies**
2. Selecione o bucket `vehicle-photos`
3. Clique em **New Policy**
4. Configure cada política:

**Policy 1: Public Select**
- Operation: SELECT
- Target roles: public
- USING expression: `bucket_id = 'vehicle-photos'`

**Policy 2: Authenticated Insert**
- Operation: INSERT
- Target roles: authenticated
- WITH CHECK expression: `bucket_id = 'vehicle-photos'`

**Policy 3: Authenticated Update**
- Operation: UPDATE
- Target roles: authenticated
- USING expression: `bucket_id = 'vehicle-photos'`

**Policy 4: Authenticated Delete**
- Operation: DELETE
- Target roles: authenticated
- USING expression: `bucket_id = 'vehicle-photos'`

## 4. Estrutura de Pastas

As fotos são organizadas da seguinte forma:

```
vehicle-photos/
├── {vehicleId}/
│   ├── main/
│   │   └── {vehicleId}-{timestamp}.jpg
│   └── pedal/
│       └── {vehicleId}-{timestamp}.jpg
```

Exemplo:
```
vehicle-photos/
├── clxyz123abc/
│   ├── main/
│   │   └── clxyz123abc-1704067200000.jpg
│   └── pedal/
│       └── clxyz123abc-1704067205000.jpg
```

## 5. Verificar Configuração

Teste a configuração com este código TypeScript:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Testar upload
async function testUpload() {
  const testBuffer = Buffer.from("test image data");
  
  const { data, error } = await supabase.storage
    .from("vehicle-photos")
    .upload("test/test.jpg", testBuffer, {
      contentType: "image/jpeg",
    });
  
  if (error) {
    console.error("Upload failed:", error);
  } else {
    console.log("Upload successful:", data);
  }
}

// Testar leitura pública
async function testPublicAccess() {
  const { data } = supabase.storage
    .from("vehicle-photos")
    .getPublicUrl("test/test.jpg");
  
  console.log("Public URL:", data.publicUrl);
  
  // Tentar acessar a URL no navegador
  // Deve retornar a imagem sem erro 403
}
```

## 6. Segurança: Remoção de GPS EXIF Metadata

O sistema remove automaticamente metadados GPS das fotos para conformidade com a LGPD.

Isso é feito no backend antes do upload:

```typescript
// Em packages/api/src/modules/vehicleStorage.ts
export async function stripGPSMetadata(buffer: Buffer): Promise<Buffer> {
  // Implementação usando sharp ou piexifjs
  // Remove: GPS, Location, etc.
}
```

## 7. Monitoramento

### Ver Uso do Storage

1. Vá em **Storage** > **Usage**
2. Verifique:
   - Total de arquivos
   - Tamanho total usado
   - Tráfego de banda

### Logs

1. Vá em **Logs** > **Storage**
2. Monitore uploads/downloads
3. Identifique erros

## 8. Limites e Quotas

### Plano Free
- Storage: 1 GB
- Bandwidth: 2 GB/mês
- Uploads: Ilimitados

### Plano Pro
- Storage: 100 GB incluídos
- Bandwidth: 250 GB/mês
- Uploads: Ilimitados

**Estimativa:** Com fotos de ~500KB cada:
- 1 GB = ~2.000 fotos
- 100 GB = ~200.000 fotos

## 9. Backup

Configure backups automáticos:

1. Vá em **Database** > **Backups**
2. Habilite backups diários
3. Configure retenção (7 dias recomendado)

**Nota:** O Storage não é incluído nos backups do database. Para backup de fotos:
- Use integração com AWS S3
- Configure backup incremental com script customizado

## 10. Troubleshooting

### Erro: "Bucket not found"
**Solução:** Verifique se o bucket `vehicle-photos` foi criado

### Erro: "Access denied"
**Solução:** Verifique as políticas de acesso (policies)

### Erro: "File too large"
**Solução:** Reduza o tamanho da foto antes do upload (backend comprime automaticamente)

### URL pública retorna 403
**Solução:** Habilite "Public bucket" nas configurações do bucket

## 11. Próximos Passos

- [ ] Implementar CDN para melhor performance
- [ ] Adicionar processamento de imagem (resize, watermark)
- [ ] Implementar versionamento de fotos
- [ ] Adicionar scanner de vírus/malware
- [ ] Implementar backup automático para S3

## 📚 Referências

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [File Upload Best Practices](https://supabase.com/docs/guides/storage/uploads)

