// Validators for forms
export const required = () => (value: any) => {
  if (value === undefined || value === null || value === "") {
    return "Campo obrigatório";
  }
  return undefined;
};

export const email = () => (value: string) => {
  if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
    return "E-mail inválido";
  }
  return undefined;
};

export const minLength = (min: number) => (value: string) => {
  if (value && value.length < min) {
    return `Mínimo de ${min} caracteres`;
  }
  return undefined;
};

export const maxLength = (max: number) => (value: string) => {
  if (value && value.length > max) {
    return `Máximo de ${max} caracteres`;
  }
  return undefined;
};

