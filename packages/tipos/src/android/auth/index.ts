import z from "zod";

import { StringComTamanhoSchema } from "@/comuns";

export const LoginAndroidSchema = z.object({
  nomeUser: StringComTamanhoSchema(10, 1),
  pass: StringComTamanhoSchema(15, 4),
});
