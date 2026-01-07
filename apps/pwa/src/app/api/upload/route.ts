import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
        }

        // Validar tipo de arquivo
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: "Tipo de arquivo inválido. Use JPG, PNG ou WEBP." }, { status: 400 });
        }

        // Validar tamanho (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "Arquivo muito grande. Máximo 5MB." }, { status: 400 });
        }

        // Verificar se Vercel Blob está configurado
        const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

        if (!blobToken) {
            // Fallback: Usar DiceBear (avatar gerado)
            console.warn("BLOB_READ_WRITE_TOKEN não configurado. Usando fallback.");
            const simulatedUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(session.user.name || "User")}`;

            return NextResponse.json({
                success: true,
                url: simulatedUrl,
                warning: "Upload real não configurado. Configure BLOB_READ_WRITE_TOKEN.",
            });
        }

        // Upload para Vercel Blob (apenas se configurado)
        try {
            const { put } = await import("@vercel/blob");

            // Gerar nome único para o arquivo
            const timestamp = Date.now();
            const extension = file.type.split('/')[1];
            const fileName = `profile-${session.user.id}-${timestamp}.${extension}`;

            const blob = await put(fileName, file, {
                access: 'public',
                addRandomSuffix: false,
            });

            return NextResponse.json({
                success: true,
                url: blob.url,
            });
        } catch (blobError) {
            console.error("Erro no Vercel Blob:", blobError);

            // Fallback em caso de erro
            const simulatedUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(session.user.name || "User")}`;

            return NextResponse.json({
                success: true,
                url: simulatedUrl,
                warning: "Erro no upload. Usando avatar gerado.",
            });
        }
    } catch (error) {
        console.error("Erro no upload:", error);
        return NextResponse.json({
            error: "Erro ao fazer upload. Tente novamente.",
            details: error instanceof Error ? error.message : "Erro desconhecido"
        }, { status: 500 });
    }
}
