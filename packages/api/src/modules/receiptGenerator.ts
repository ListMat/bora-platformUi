import PDFDocument from "pdfkit";

export interface ReceiptData {
  lessonId: string;
  studentName: string;
  studentCPF?: string;
  instructorName: string;
  instructorCNH?: string;
  instructorCredential?: string;
  scheduledAt: Date;
  startedAt: Date;
  endedAt: Date;
  duration: number; // minutos
  price: number;
  pickupAddress: string;
}

/**
 * Gera um PDF de recibo de aula prática
 * @param data Dados da aula para gerar o recibo
 * @returns Buffer do PDF gerado
 */
export async function generateReceipt(data: ReceiptData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Header
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("RECIBO DE AULA PRÁTICA", { align: "center" })
        .moveDown(0.5);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text("BORA - Plataforma de Aulas de Direção", { align: "center" })
        .moveDown(2);

      // Informações do Aluno
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("DADOS DO ALUNO")
        .moveDown(0.5);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Nome: ${data.studentName}`)
        .moveDown(0.3);

      if (data.studentCPF) {
        doc.text(`CPF: ${data.studentCPF}`).moveDown(1);
      } else {
        doc.moveDown(1);
      }

      // Informações do Instrutor
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("DADOS DO INSTRUTOR")
        .moveDown(0.5);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Nome: ${data.instructorName}`)
        .moveDown(0.3);

      if (data.instructorCNH) {
        doc.text(`CNH: ${data.instructorCNH}`).moveDown(0.3);
      }

      if (data.instructorCredential) {
        doc.text(`Credencial: ${data.instructorCredential}`).moveDown(1);
      } else {
        doc.moveDown(1);
      }

      // Informações da Aula
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("DETALHES DA AULA")
        .moveDown(0.5);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Código da Aula: ${data.lessonId.substring(0, 8).toUpperCase()}`)
        .moveDown(0.3);

      doc
        .text(`Local de Partida: ${data.pickupAddress}`)
        .moveDown(0.3);

      doc
        .text(`Data Agendada: ${data.scheduledAt.toLocaleDateString("pt-BR")} às ${data.scheduledAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`)
        .moveDown(0.3);

      doc
        .text(`Início Real: ${data.startedAt.toLocaleDateString("pt-BR")} às ${data.startedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`)
        .moveDown(0.3);

      doc
        .text(`Término: ${data.endedAt.toLocaleDateString("pt-BR")} às ${data.endedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`)
        .moveDown(0.3);

      doc
        .text(`Duração: ${data.duration} minutos`)
        .moveDown(1);

      // Valor
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("VALOR PAGO")
        .moveDown(0.5);

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text(`R$ ${data.price.toFixed(2)}`, { align: "center" })
        .moveDown(2);

      // Rodapé
      doc
        .fontSize(9)
        .font("Helvetica")
        .text(`Emitido em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`, { align: "center" })
        .moveDown(0.5);

      doc
        .fontSize(8)
        .text("Este documento é válido como comprovante de aula prática realizada.", { align: "center" })
        .moveDown(0.3);

      doc
        .text("BORA - Tecnologia para Autoescolas", { align: "center" });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Gera o nome do arquivo do recibo
 * @param lessonId ID da aula
 * @returns Nome do arquivo formatado
 */
export function generateReceiptFilename(lessonId: string): string {
  const timestamp = new Date().toISOString().split("T")[0];
  return `recibo_${lessonId.substring(0, 8)}_${timestamp}.pdf`;
}
