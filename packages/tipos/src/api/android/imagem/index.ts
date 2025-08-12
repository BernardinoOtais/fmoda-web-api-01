import z from "zod";

export const GetFotoCaminho = z.object({
  caminho: z.string(),
});
