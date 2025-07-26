import { IdBmOpDto } from "@repo/tipos/qualidade_balancom";
import sql from "sql-template-tag";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const deleteOpBd = async (dados: IdBmOpDto) =>
  prismaQualidade.$queryRaw(sql`exec BmApagoUmaOp ${dados.idBm}, ${dados.op}`);
