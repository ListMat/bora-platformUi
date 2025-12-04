import ptBR from "./locales/pt-BR.json";

export const locales = {
  "pt-BR": ptBR,
};

export type Locale = keyof typeof locales;
export type Translation = typeof ptBR;

