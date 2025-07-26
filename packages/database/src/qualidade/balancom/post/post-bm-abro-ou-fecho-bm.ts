import { IdBmBooleanAbreOuFecha } from "@repo/tipos/qualidade_balancom";
import { z } from "zod";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const postAbroOuFechoBmBd = async (
  value: z.infer<typeof IdBmBooleanAbreOuFecha>
) =>
  await prismaQualidade.$executeRaw`UPDATE bm SET fechado = iif(fechado=0,1,0) WHERE idBm = ${value.idBm}`;
