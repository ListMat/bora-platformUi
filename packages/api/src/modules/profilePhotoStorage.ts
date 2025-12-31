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

const BUCKET_NAME = "profile-photos";

/**
 * Faz upload de uma foto de perfil para o Supabase Storage
 * @param userId ID do usuário
 * @param photoBuffer Buffer da foto
 * @param filename Nome do arquivo
 * @returns URL pública da foto
 */
export async function uploadProfilePhoto(
  userId: string,
  photoBuffer: Buffer,
  filename: string
): Promise<string> {
  const path = `${userId}/${filename}`;

  // Validar tamanho do arquivo (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (photoBuffer.length > maxSize) {
    throw new Error("Photo size exceeds 5MB limit");
  }

  // Validar tipo de arquivo (apenas imagens)
  const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const fileExtension = filename
    .toLowerCase()
    .substring(filename.lastIndexOf("."));
  if (!validExtensions.includes(fileExtension)) {
    throw new Error(
      "Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed"
    );
  }

  const contentType =
    fileExtension === ".png"
      ? "image/png"
      : fileExtension === ".webp"
      ? "image/webp"
      : "image/jpeg";

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, photoBuffer, {
      contentType,
      upsert: true,
      cacheControl: "3600",
    });

  if (error) {
    console.error("Error uploading profile photo:", error);
    throw new Error(`Failed to upload profile photo: ${error.message}`);
  }

  // Gerar URL pública
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
}

/**
 * Remove uma foto de perfil do Supabase Storage
 * @param userId ID do usuário
 */
export async function deleteProfilePhoto(userId: string): Promise<void> {
  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(userId);

  if (listError) {
    console.error("Error listing profile photos:", listError);
    return; // Não falhar se não houver fotos
  }

  if (files && files.length > 0) {
    const paths = files.map((file) => `${userId}/${file.name}`);
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(paths);

    if (deleteError) {
      console.error("Error deleting profile photos:", deleteError);
      throw new Error(
        `Failed to delete profile photos: ${deleteError.message}`
      );
    }
  }
}

/**
 * Converte base64 para Buffer
 * @param base64String String base64 com ou sem data URI
 * @returns Buffer da imagem
 */
export function base64ToBuffer(base64String: string): Buffer {
  // Remove o data URI prefix se existir (data:image/jpeg;base64,...)
  const base64Data = base64String.includes(",")
    ? base64String.split(",")[1]
    : base64String;

  return Buffer.from(base64Data, "base64");
}

/**
 * Gera um filename único para a foto de perfil
 * @param userId ID do usuário
 * @param extension Extensão do arquivo (.jpg, .png, .webp)
 * @returns Nome do arquivo
 */
export function generatePhotoFilename(
  userId: string,
  extension: string = "jpg"
): string {
  const timestamp = Date.now();
  return `profile-${userId}-${timestamp}.${extension}`;
}

