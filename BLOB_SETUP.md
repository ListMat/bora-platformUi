# Vercel Blob Storage Configuration

Para habilitar o upload de imagens de perfil, você precisa configurar o Vercel Blob:

## 1. Criar um Blob Store na Vercel

1. Acesse https://vercel.com/dashboard
2. Vá em "Storage" → "Create Database" → "Blob"
3. Dê um nome (ex: "bora-uploads")
4. Copie o token gerado

## 2. Adicionar Variável de Ambiente

Adicione no arquivo `.env` ou `.env.local`:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXXXXXX
```

## 3. Configurar na Vercel (Produção)

1. Vá em Settings → Environment Variables
2. Adicione `BLOB_READ_WRITE_TOKEN` com o valor do token
3. Marque para todos os ambientes (Production, Preview, Development)

## Alternativas ao Vercel Blob

Se preferir usar outro serviço de storage, edite o arquivo:
`apps/pwa/src/app/api/upload/route.ts`

### Cloudinary
```bash
pnpm add cloudinary
```

### AWS S3
```bash
pnpm add @aws-sdk/client-s3
```

### Supabase Storage
```bash
pnpm add @supabase/supabase-js
```

## Modo de Desenvolvimento (Sem Blob)

Se não configurar o `BLOB_READ_WRITE_TOKEN`, o upload usará URLs simuladas do DiceBear.
