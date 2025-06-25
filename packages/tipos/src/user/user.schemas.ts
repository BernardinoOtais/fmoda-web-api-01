import { z } from "zod";

export const LoginSchema = z.object({
  nomeUser: z.string().min(1, { message: "Username é obrigatório." }),
  password: z.string().min(1, { message: "A password é obrigatória." }),
  message: z.string().optional(),
});

export type LoginDto = z.infer<typeof LoginSchema>;
