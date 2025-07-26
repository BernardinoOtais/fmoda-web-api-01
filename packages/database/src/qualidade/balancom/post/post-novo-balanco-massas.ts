import { OpDto } from "@repo/tipos/qualidade_balancom";
import sql from "sql-template-tag";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const postNovoBalancoMassasBd = async (dados: OpDto) =>
  prismaQualidade.$queryRaw(sql`exec BmPostPrimeiraOp ${dados.op} `);
