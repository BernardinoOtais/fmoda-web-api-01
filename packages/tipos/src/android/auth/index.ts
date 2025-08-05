import z from "zod";

import { StringComTamanhoSchema } from "@/comuns";

//import { StringComTamanhoSchema } from "../../comuns/index.js";

export const LoginAndroidSchema = z.object({
  nomeUser: StringComTamanhoSchema(10, 1),
  pass: StringComTamanhoSchema(15, 4),
});
