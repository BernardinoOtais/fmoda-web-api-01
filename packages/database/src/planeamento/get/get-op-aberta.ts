import { PlaneamentoPostOps } from "@repo/tipos/planeamento";
import sql, { join } from "sql-template-tag";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

type tabelaRecebida = PlaneamentoPostOps[];
export const getOpAbertaDb = async (ops: number[]) => {
  if (!ops.length) return [];

  // Create the SQL query using sql-template-tag
  const query = sql`
    SELECT 
      op_chave = trim(bo.bostamp),
      op = trim(cast(bo.obrano as char(15))),
      ref = trim(bi_first.ref),
      modelo = trim(bo.marca) + '/' +
               LTRIM(RTRIM(ISNULL(
                   IIF(CHARINDEX(' - ', bi_first.cor) > 0,
                       LEFT(bi_first.cor, CHARINDEX(' - ', bi_first.cor)),
                       bi_first.cor
                   ), ''
               ))),
      descricao = LTRIM(RTRIM(ISNULL(REPLACE(bi_first.design, LTRIM(RTRIM(bo.marca)), ''), ''))),
      pedido = LTRIM(RTRIM(ISNULL(
                   IIF(CHARINDEX(';', bo3.u_tpestamp) > 0,
                       LEFT(bo3.u_tpestamp, CHARINDEX(';', bo3.u_tpestamp) - 1),
                       bo3.u_tpestamp
                   ), ''
               ))),
      corNome = trim(bi_first.cor),
      quantidade = LTRIM(RTRIM(CAST(CAST(ISNULL(bi_sum.total_qtt, 0) AS INT) AS VARCHAR(15)))),
      departamento = bo.tabela2,
      foto = REPLACE(fref.u_imagem, '\\\\10.0.0.13\\Winsig\\DEP\\PHC\\docsphc\\desenhos', 'Desenhos')
    FROM 
      FMO_PHC..bo
    JOIN 
      FMO_PHC..bo2 ON bo.bostamp = bo2.bo2stamp
    JOIN 
      FMO_PHC..bo3 ON bo.bostamp = bo3.bo3stamp
    JOIN 
      FMO_PHC..fref ON bo.fref = fref.fref
    OUTER APPLY (
        SELECT TOP 1 
            design,
            cor,
            ref
        FROM FMO_PHC..bi 
        WHERE bi.bostamp = bo.bostamp
    ) bi_first
    OUTER APPLY (
        SELECT SUM(qtt) AS total_qtt
        FROM FMO_PHC..bi 
        WHERE bi.bostamp = bo.bostamp
    ) bi_sum
    WHERE 
      bo.ndos = 1
      AND bo2.area = 'MARROCOS'
      AND bo.fechada = 0
      AND bo.tabela1 != 'amostra'
      AND bo.obrano IN (${join(ops)})
    ORDER BY 1
  `;

  return prismaQualidade.$queryRaw<tabelaRecebida>(query);
};
