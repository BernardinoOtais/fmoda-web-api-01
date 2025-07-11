import { z } from "zod";

export const LoginSchema = z.object({
  nomeUser: z.string().min(1, { message: "Username é obrigatório." }),
  password: z.string().min(1, { message: "A password é obrigatória." }),
  message: z.string().optional(),
});

const chave = z
  .string()
  .max(50, { message: "Não pode ter mais de 50 caracteres." })
  .min(23, { message: "Não pode ter menos de 23 caracteres." });

export const PapeisSchema = z.object({
  papeis: z.array(
    z.object({
      idPapel: chave,
      descricao: z.string(),
    })
  ),
});

export type LoginDto = z.infer<typeof LoginSchema>;

const PasswordValidaSchema = z
  .string()
  .min(8, { message: "Deve ter pelo menos 8 caracteres." })
  .regex(/[a-zA-Z]/, {
    message: "Deve conter pelo menos uma letra.",
  })
  .trim();

export const CriaUserComValidacaoPasswordSchema = z
  .object({
    nomeUser: z
      .string()
      .min(4, { message: "Deve ter pelo menos 4 caracteres." })
      .max(50, { message: "Não pode ter mais de 50 caracteres." }),
    nome: z
      .string()
      .min(4, { message: "Deve ter pelo menos 4 caracteres." })
      .max(50, { message: "Não pode ter mais de 50 caracteres." }),
    apelido: z
      .string()
      .min(4, { message: "Deve ter pelo menos 4 caracteres." })
      .max(50, { message: "Não pode ter mais de 50 caracteres." }),
    email: z.string().email(),
    password: PasswordValidaSchema,
    confirmPassword: PasswordValidaSchema,
    message: z.string().optional(),
    papeis: z.array(chave).min(1, { message: "Deve ter pelo menos um papel." }),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As Passwords não são iguais.",
        path: ["confirmPassword"],
      });
    }
  });

export type CriaUserComValidacaoPasswordDto = z.infer<
  typeof CriaUserComValidacaoPasswordSchema
>;

export const PostPapeisSchema = z.object({
  userId: z.string().min(4, { message: "Deve ter pelo menos 4 caracteres." }),
  papeis: z.array(
    z.string().min(4, { message: "Deve ter pelo menos 4 caracteres." })
  ),
});
