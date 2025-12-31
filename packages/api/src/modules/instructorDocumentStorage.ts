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

const BUCKET_NAME = "instructor-documents";

/**
 * Faz upload de um documento de instrutor para o Supabase Storage
 * @param instructorId ID do instrutor
 * @param documentBuffer Buffer do documento
 * @param filename Nome do arquivo
 * @param documentType Tipo do documento ('cnh' | 'credential')
 * @returns URL pública do documento
 */
export async function uploadInstructorDocument(
  instructorId: string,
  documentBuffer: Buffer,
  filename: string,
  documentType: "cnh" | "credential"
): Promise<string> {
  const path = `${instructorId}/${documentType}/${filename}`;

  // Validar tamanho do arquivo (max 10MB para documentos)
  const maxSize = 10 * 1024 * 1024;
  if (documentBuffer.length > maxSize) {
    throw new Error("Document size exceeds 10MB limit");
  }

  // Validar tipo de arquivo (PDF ou imagem)
  const validExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
  const fileExtension = filename
    .toLowerCase()
    .substring(filename.lastIndexOf("."));
  if (!validExtensions.includes(fileExtension)) {
    throw new Error(
      "Invalid file type. Only PDF, JPG, JPEG, and PNG are allowed"
    );
  }

  const contentType =
    fileExtension === ".pdf"
      ? "application/pdf"
      : fileExtension === ".png"
      ? "image/png"
      : "image/jpeg";

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, documentBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error("Error uploading instructor document:", error);
    throw new Error(`Failed to upload document: ${error.message}`);
  }

  // Gerar URL pública
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
}

/**
 * Remove um documento de instrutor do Supabase Storage
 * @param instructorId ID do instrutor
 * @param documentType Tipo do documento ('cnh' | 'credential')
 */
export async function deleteInstructorDocument(
  instructorId: string,
  documentType: "cnh" | "credential"
): Promise<void> {
  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(`${instructorId}/${documentType}`);

  if (listError) {
    console.error("Error listing instructor documents:", listError);
    throw new Error(
      `Failed to list instructor documents: ${listError.message}`
    );
  }

  if (files && files.length > 0) {
    const paths = files.map(
      (file) => `${instructorId}/${documentType}/${file.name}`
    );
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(paths);

    if (deleteError) {
      console.error("Error deleting instructor documents:", deleteError);
      throw new Error(
        `Failed to delete instructor documents: ${deleteError.message}`
      );
    }
  }
}

/**
 * Converte base64 para Buffer
 * @param base64String String base64 com ou sem data URI
 * @returns Buffer do documento
 */
export function base64ToBuffer(base64String: string): Buffer {
  // Remove o data URI prefix se existir (data:image/jpeg;base64,... ou data:application/pdf;base64,...)
  const base64Data = base64String.includes(",")
    ? base64String.split(",")[1]
    : base64String;

  return Buffer.from(base64Data, "base64");
}

/**
 * Gera um filename único para o documento
 * @param instructorId ID do instrutor
 * @param documentType Tipo do documento ('cnh' | 'credential')
 * @param extension Extensão do arquivo (.pdf, .jpg, .png)
 * @returns Nome do arquivo
 */
export function generateDocumentFilename(
  instructorId: string,
  documentType: "cnh" | "credential",
  extension: string = "pdf"
): string {
  const timestamp = Date.now();
  return `${documentType}-${instructorId}-${timestamp}.${extension}`;
}

