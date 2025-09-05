import { PlaneamentoOpsNaoPlaneadas } from "@repo/tipos/planeamento";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

type tabelaRecebida = PlaneamentoOpsNaoPlaneadas[];
export const getOpAbertasDb =
  async () => prismaEnvios.$queryRaw<tabelaRecebida>`
SELECT 
	id			    = trim(cast(bo.obrano as char(15))),
	op			    = trim(cast(bo.obrano as char(15))),
    modelo          = trim(bo.marca) + '/' + 
				    LTRIM(RTRIM(ISNULL(
                        IIF(CHARINDEX(' - ', bi_first.cor) > 0,
                            LEFT(bi_first.cor, CHARINDEX(' - ', bi_first.cor)),
                            bi_first.cor
                        ), ''
                    ))),
    descricao       = LTRIM(RTRIM(ISNULL(REPLACE(bi_first.design, LTRIM(RTRIM(bo.marca)), ''), ''))),
    pedido          = LTRIM(RTRIM(ISNULL(
                        IIF(CHARINDEX(';', bo3.u_tpestamp) > 0,
                            LEFT(bo3.u_tpestamp, CHARINDEX(';', bo3.u_tpestamp) - 1),
                            bo3.u_tpestamp
                        ), ''
                    ))),
    corNome         = bi_first.cor,
	quantidade      = LTRIM(RTRIM(CAST(CAST(ISNULL(bi_sum.total_qtt, 0) AS INT) AS VARCHAR(15)))),
	departamento    = bo.tabela2,
	foto           = REPLACE(fref.u_imagem, '\\10.0.0.13\Winsig\DEP\PHC\docsphc\desenhos', 'Desenhos')
FROM 
    FMO_PHC..bo
JOIN 
    FMO_PHC..bo2 ON bo.bostamp = bo2.bo2stamp
JOIN 
    FMO_PHC..bo3 ON bo.bostamp = bo3.bo3stamp
join 
	FMO_PHC..fref on bo.fref = fref.fref
OUTER APPLY (
    SELECT TOP 1 
        design,
        cor
    FROM FMO_PHC..bi 
    WHERE bi.bostamp = bo.bostamp
) bi_first
OUTER APPLY (
    SELECT SUM(qtt) AS total_qtt
    FROM FMO_PHC..bi 
    WHERE bi.bostamp = bo.bostamp
) bi_sum
WHERE bo.ndos = 1
	and bo2.area = 'MARROCOS'
	and bo.fechada = 0
	and bo.tabela1 != 'amostra'
order by 1`;
