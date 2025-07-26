import { IdBmOpEmTextoSchema } from "@repo/tipos/qualidade_balancom";
import sql from "sql-template-tag";
import { z } from "zod";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const resetBmBd = async (value: z.infer<typeof IdBmOpEmTextoSchema>) =>
  prismaQualidade.$queryRaw(sql`
exec BmReset ${value.idBm} 
`);
