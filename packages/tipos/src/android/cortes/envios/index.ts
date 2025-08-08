import z from "zod";

export const GetEnviosSchema = z.object({
  opIcf: z.string(),
});

export const PostCortesEnvioSchema = z.object({
  nomeUser: z.string(),
});
