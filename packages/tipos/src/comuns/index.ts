import { z } from "zod";

export const InteiroNaoNegativoSchema = z.coerce
  .number({
    required_error: "Tem que inserrir números...",
    invalid_type_error: "Formato errado...",
  })
  .int({ message: "Tem que ser inteiro...." })
  .nonnegative({ message: "Tem que ser positivo..." });

export const VerdadeiroOuFalsoSchema = z
  .union([z.boolean(), z.string()])
  .transform((val) => {
    if (typeof val === "boolean") return val;
    if (val === "true") return true;
    if (val === "false") return false;
    throw new Error("Invalid boolean value");
  });

export const StringComTamanhoSchema = (tamanho: number, minimo?: number) => {
  let schema = z.string().max(tamanho, {
    message: `Tem que ter no máximo ${tamanho} caracteres...`,
  });

  if (typeof minimo === "number") {
    schema = schema.min(minimo, {
      message: `Mínimo ${minimo} caracteres`,
    });
  }
  return schema;
};

export const ChavePhcSchema = z.string().max(25).min(17);

export const FloatZeroSchema = z.preprocess(
  (val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed === "") return undefined;
      const parsed = parseFloat(trimmed.replace(",", "."));
      return isNaN(parsed) ? undefined : parsed;
    }

    if (typeof val === "number") return val;

    return undefined;
  },
  z.number().refine((val) => val >= 0, {
    message: "O valor tem de ser maior ou igual a 0",
  })
) as z.ZodType<number, z.ZodTypeDef, number>;
