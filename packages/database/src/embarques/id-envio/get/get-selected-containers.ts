import { IdNumeroInteiroNaoNegativoDto } from "@repo/tipos/comuns";
import { EmbarqueBreadCrumbContainers } from "@repo/tipos/embarques";
import sql from "sql-template-tag";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getSelectedContainersDb = async (
  dados: IdNumeroInteiroNaoNegativoDto
) =>
  await prismaEnvios.$queryRaw<EmbarqueBreadCrumbContainers[]>(sql`
    WITH ContainerHierarchy AS (
        SELECT idContainer, idContainerPai, idTipoContainer, nContainer
        FROM Container
        WHERE idEnvio = ${dados.id} AND idContainer = ${dados.idd}

        UNION ALL

        SELECT c.idContainer, c.idContainerPai, c.idTipoContainer, c.nContainer
        FROM Container c
        INNER JOIN ContainerHierarchy ch ON c.idContainer = ch.idContainerPai
    )
    SELECT 
      a.idContainer AS id,
      TRIM(c.Descricao) AS nome,
      (
        SELECT COUNT(idContainer)
        FROM Container
        WHERE idContainerPai = a.idContainer
      ) AS badge,
      a.nContainer AS numero
    FROM ContainerHierarchy a
    JOIN TipoContainer b ON a.idTipoContainer = b.idTipoContainer
    JOIN Item c ON b.idItem = c.idItem
    ORDER BY a.idContainerPai
  `);
