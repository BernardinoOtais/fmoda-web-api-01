import { OpCamioesEnviosArraySchema } from "@repo/tipos/planeamento";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getOpCamioesEnviosDb = async (op: number) => {
  const resultado = await prismaQualidade.$queryRaw`

IF OBJECT_ID('tempdb..#OpCamioesEnviosDbFaturas') IS NOT NULL
DROP TABLE #OpCamioesEnviosDbFaturas

select 
	boEnc.bostamp,
	ft.fno,
	ft.nmdoc,
	ft.fdata,
	fi.ref,
	fi.tam,
	qttFaturada = sum(case
		when ft.nmdoc = 'Credit Note' then  -fi.qtt
		when ft.nmdoc = 'Credit Note NLS' then  0
		when ft.nmdoc = 'Nota de Crédito' then  -fi.qtt
		when ft.nmdoc = 'Nota de Débito NLS' then  0
		else fi.qtt end),
	valor = sum(fi.etiliquido)
	into #OpCamioesEnviosDbFaturas
from 
	FMO_PHC..ft
join 
	FMO_PHC..fi  on ft.ftstamp = fi.ftstamp
left 
	join FMO_PHC..fi aux on aux.fistamp = fi.ofistamp
left 
	join FMO_PHC..bi biEnc on biEnc.bistamp = case when fi.ofistamp = '' then fi.bistamp else aux.bistamp end
left 
	join FMO_PHC..bo boEnc on boEnc.bostamp = biEnc.bostamp
where 
	ft.ndoc not in (7,10,12,15,20) and 
	fi.ref !='' and 
	fi.ref like 'pa%' and 
	boEnc.obrano = ${op}
group by
	boEnc.bostamp,
	ft.fno,
	ft.nmdoc,
	ft.fdata,
	fi.ref,
	fi.tam

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
    envios = ISNULL(envios.envios, '[]'),
    fornecedorValor = ISNULL(fornecedorValor.fornecedorValor, '[]'),
	dCamioes = ISNULL(dCamioes.dCamioes,'[]'),
    dFaturas = ISNULL(dFaturas.dFaturas,'[]'),
	faturas = ISNULL(faturas.faturas,'[]')
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
    ) qttTotal
    OUTER APPLY(
        SELECT fornecedorValor = (
			select 
				b.idValorizado,
				bostamp = trim(a.bostamp), 
				nome = trim(b.nome),
				b.valorServico
			from	
				FMO_PHC..fm_opDescValorizado a
			join 
				FMO_PHC..fm_descValorizado b on a.idValorizado = b.idValorizado
			where 
                b.idTipo = 1 and a.bostamp = bo.bostamp
            FOR JSON PATH
        )
    ) fornecedorValor
	OUTER APPLY(
		SELECT dCamioes = (
			SELECT 
				b.idDataQtt,
				bostamp = trim(a.bostamp), 
				data =b.data,
				qtt = b.qtt
			FROM 
				FMO_PHC..fm_opDataQtt a
			join 
				FMO_PHC..fm_dataQtt b on a.idDataQtt = b.idDataQtt
			WHERE 
				a.bostamp = bo.bostamp and b.idTipo = 2 /* camioes */
            ORDER BY    
                b.data
			FOR JSON PATH
		)
	) dCamioes
	OUTER APPLY(
		SELECT dFaturas = (
			SELECT 
				b.idDataQtt,
				bostamp = trim(a.bostamp), 
				data =b.data,
				qtt = b.qtt
			FROM 
				FMO_PHC..fm_opDataQtt a
			join 
				FMO_PHC..fm_dataQtt b on a.idDataQtt = b.idDataQtt
			WHERE 
				a.bostamp = bo.bostamp and b.idTipo = 3 /* Faturas */
            ORDER BY    
                b.data
			FOR JSON PATH
		)
	)dFaturas
	OUTER APPLY(
		SELECT faturas = (
            select 
				f.fdata,
				f.fno,
				f.nmdoc,
				f.ref,
				detalheFaturado = isnull((
					select
						tam = SUBSTRING(TRIM(sgt.tam), 0, CHARINDEX(' - ', sgt.tam)), 
						ordem = sgt.pos,
						qtt =sum(isnull(fd.qttFaturada,0))
					from 
						FMO_PHC..sgt
					left join
						#OpCamioesEnviosDbFaturas fd on sgt.tam = fd.tam and sgt.ref = fd.ref
					where 
						f.ref = sgt.ref and 
						f.fdata = fd.fdata and 
						f.fno = fd.fno and
						f.nmdoc = fd.nmdoc 
					group by
						SUBSTRING(TRIM(sgt.tam), 0, CHARINDEX(' - ', sgt.tam)), 
						sgt.pos
					order by 
						sgt.pos
					for json path
				),'[]'),
				qttFaturada = sum(f.qttFaturada),
				valor = sum(f.valor)
			from 
				#OpCamioesEnviosDbFaturas f
			group by
				f.fdata,
				f.fno,
				f.nmdoc,
				f.ref
			order by
				f.fdata,
				f.fno,
				f.nmdoc,
				f.ref
			for json path
		)
	)faturas
WHERE 
    bo.ndos = 1 
    AND bo.obrano = ${op}`;

  // console.log(resultado);
  return OpCamioesEnviosArraySchema.parse(resultado);
};
