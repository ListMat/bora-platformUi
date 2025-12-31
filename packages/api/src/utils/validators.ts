/**
 * Validação de CPF brasileiro
 * @param cpf CPF com ou sem formatação
 * @returns true se válido
 */
export function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, "");

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validação dos dígitos verificadores
  let sum = 0;
  let remainder: number;

  // Valida primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
}

/**
 * Validação de CNH brasileira
 * @param cnh Número da CNH
 * @returns true se válido
 */
export function validateCNH(cnh: string): boolean {
  // Remove caracteres não numéricos
  const cleanCNH = cnh.replace(/\D/g, "");

  // CNH deve ter 11 dígitos
  if (cleanCNH.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCNH)) return false;

  // Validação dos dígitos verificadores da CNH
  let sum = 0;
  let digit1 = 0;
  let digit2 = 0;

  // Calcula primeiro dígito verificador
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCNH[i]) * (9 - i);
  }
  digit1 = sum % 11;
  if (digit1 >= 10) {
    digit1 = 0;
  }

  // Calcula segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCNH[i]) * (1 + i);
  }
  digit2 = sum % 11;
  if (digit2 >= 10) {
    digit2 = 0;
  }

  // Verifica se os dígitos verificadores estão corretos
  return (
    digit1 === parseInt(cleanCNH[9]) && digit2 === parseInt(cleanCNH[10])
  );
}

/**
 * Formata CPF para exibição (xxx.xxx.xxx-xx)
 */
export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, "");
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Formata CNH para exibição (xxxxxxxxxxx)
 */
export function formatCNH(cnh: string): string {
  return cnh.replace(/\D/g, "");
}

