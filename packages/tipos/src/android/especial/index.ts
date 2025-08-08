import z from "zod";

import { InteiroNaoNegativoSchema } from "@/comuns";

export const AbrePedidoSchema = z.object({
  idEnvioMarrocos: InteiroNaoNegativoSchema,
});
