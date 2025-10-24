import { OpCamioesEnviosArraySchema } from "@repo/tipos/planeamento";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getOpCamioesEnviosDb = async (op: number) => {
  const resultado = await prismaQualidade.$queryRaw`
SELECT 
    stamp = bo.bostamp,
    op = bo.obrano,
    client = TRIM(bo.tabela2),
	foto = trim(REPLACE(fref.u_imagem, '\\\\10.0.0.13\\Winsig\\DEP\\PHC\\docsphc\\desenhos', 'Desenhos')),
    modelo = TRIM(bo.marca),
    area = TRIM(bo2.area),
    pedido = TRIM(bo3.u_tpestamp),
    qttTotal = qttTotal.qttTotal,
    obs = ISNULL(fm_planObs.obs, ''),
    detalhe = ISNULL(detalhePedido.detalhe, '[]'),
    fornecedor = TRIM(bo3.u_nmforn),
    camioes = ISNULL(camioes.camioes, '[]'),
    envios = ISNULL(envios.envios, '[]')
FROM 
    FMO_PHC..bo
    INNER JOIN FMO_PHC..bo2 ON bo.bostamp = bo2.bo2stamp
    INNER JOIN FMO_PHC..bo3 ON bo.bostamp = bo3.bo3stamp
    INNER JOIN FMO_PHC..fref ON bo.fref = fref.fref
    LEFT JOIN FMO_PHC..fm_planObs on bo.bostamp = fm_planObs.bostamp
    OUTER APPLY (
        SELECT detalhe = (
            SELECT 
                bi.atedata, 
                cor = LTRIM(RTRIM(bi.cor)),
                quantidades = ISNULL((
                    SELECT
                        tam = LTRIM(RTRIM(
                            CASE 
                                WHEN CHARINDEX(' - ', tam.tam) > 0 
                                THEN LEFT(tam.tam, CHARINDEX(' - ', tam.tam) - 1)
                                ELSE tam.tam
                            END
                        )),
                        qtt = SUM(tam.qtt),
                        ordem = MIN(tam.lordem)
                    FROM FMO_PHC..bi tam
                    WHERE 
                        tam.bostamp = bo.bostamp 
                        AND tam.atedata = bi.atedata 
                        AND tam.cor = bi.cor
                    GROUP BY tam.tam
                    ORDER BY 3
                    FOR JSON PATH
                ), '[]')
            FROM FMO_PHC..bi
            WHERE bi.bostamp = bo.bostamp
            GROUP BY bi.atedata, bi.cor
            ORDER BY bi.atedata
            FOR JSON PATH
        )
    ) detalhePedido
    OUTER APPLY (
        SELECT camioes = (
            SELECT n, dataIn, valor
            FROM (
                VALUES 
                    (1, bo3.u_datacam1, bo3.u_camqtt1),
                    (2, bo3.u_datacam2, bo3.u_camqtt2),
                    (3, bo3.u_datacam3, bo3.u_camqtt3),
                    (4, bo3.u_datacam4, bo3.u_camqtt4),
                    (5, bo3.u_datacam5, bo3.u_camqtt5),
                    (6, bo3.u_datacam6, bo3.u_camqtt6)
            ) c(n, dataIn, valor)
            FOR JSON PATH
        )
    ) camioes
    OUTER APPLY (
        SELECT envios = (
            SELECT n, dataIn, valor
            FROM (
                VALUES 
                    (1, bo3.u_datafor1, bo3.u_dfqtt1),
                    (2, bo3.u_datafor2, bo3.u_dfqtt2),
                    (3, bo3.u_datafor3, bo3.u_dfqtt3),
                    (4, bo3.u_datafor4, bo3.u_dfqtt4),
                    (5, bo3.u_datafor5, bo3.u_dfqtt5),
                    (6, bo3.u_datafor6, bo3.u_dfqtt6)
            ) c(n, dataIn, valor)
            FOR JSON PATH
        )
    ) envios
    OUTER APPLY(
        SELECT 
            qttTotal = SUM(qtt)
        FROM 
            FMO_PHC..bi
        WHERE
            bi.bostamp = bo.bostamp
    )qttTotal
WHERE 
    bo.ndos = 1 
    AND bo.obrano = ${op}`;
  return OpCamioesEnviosArraySchema.parse(resultado);
};
