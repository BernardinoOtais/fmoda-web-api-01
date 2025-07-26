import { IdBmOpDto } from "@repo/tipos/qualidade_balancom";
import sql from "sql-template-tag";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

type EstadoResultado = { estado: "incompativel" | "sucesso" };
export const postOpBMExistenteBd = async (value: IdBmOpDto) =>
  prismaQualidade.$queryRaw<EstadoResultado[]>(sql`
exec BmJuntoNovaOp ${value.idBm}, ${value.op}
`);
