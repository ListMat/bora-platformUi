import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing Supabase credentials. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const BUCKET_NAME = "receipts";

/**
 * Faz upload de um recibo em PDF para o Supabase Storage
 * @param lessonId ID da aula
 * @param pdfBuffer Buffer do PDF
 * @param filename Nome do arquivo
 * @returns URL pública do recibo
 */
export async function uploadReceipt(
  lessonId: string,
  pdfBuffer: Buffer,
  filename: string
): Promise<string> {
  const path = `${lessonId}/${filename}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) {
    console.error("Error uploading receipt:", error);
    throw new Error(`Failed to upload receipt: ${error.message}`);
  }

  // Gerar URL pública
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
}

/**
 * Remove um recibo do Supabase Storage
 * @param lessonId ID da aula
 * @param filename Nome do arquivo
 */
export async function deleteReceipt(
  lessonId: string,
  filename: string
): Promise<void> {
  const path = `${lessonId}/${filename}`;

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

  if (error) {
    console.error("Error deleting receipt:", error);
    throw new Error(`Failed to delete receipt: ${error.message}`);
  }
}

/**
 * Lista todos os recibos de uma aula
 * @param lessonId ID da aula
 * @returns Lista de arquivos
 */
export async function listReceipts(lessonId: string) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(lessonId);

  if (error) {
    console.error("Error listing receipts:", error);
    throw new Error(`Failed to list receipts: ${error.message}`);
  }

  return data;
}
