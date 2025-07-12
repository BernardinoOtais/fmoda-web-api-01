import { ListaParaImprimrirDto } from "@repo/tipos/embarques_idenvio";
import sql from "sql-template-tag";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getContainersConteudoToPrintDb = async (
  idEnvio: number,
  idContainer?: number
) => {
  //console.log("getContainersConteudoToPrintDb: ", idEnvio, idContainer);

  const whereClause = idContainer
    ? sql`a.idContainer = ${idContainer}`
    : sql`a.idContainerPai IS NULL`;

  const [linhas] = await prismaEnvios.$queryRaw<{ dados: string }[]>(sql`
        WITH ContainerHierarchy AS (
            SELECT
                a.idContainer AS idA,
                aaa.Descricao AS descA,
                a.idContainer,
                a.idTipoContainer,
                a.nContainer AS nContainerA,
                a.altura,
                a.ordem AS ordemA,
                
                b.idContainer AS idB,
                b.idContainer AS idCTb,
                b.idTipoContainer idTb,
                bbb.Descricao AS descB,
                b.nContainer AS nContainerB,
                b.ordem AS ordemB,
                b.altura AS alturaB,
                
                c.idContainer AS idC,
                ccc.Descricao AS descC,
                c.idTipoContainer AS idTc,
                c.nContainer AS nContainerC,
                c.altura as alturaC,
                c.ordem AS ordemC
            FROM 
                Container a
            JOIN 
                TipoContainer aa ON aa.idTipoContainer = a.idTipoContainer
            JOIN 
                Item aaa ON aa.idItem = aaa.idItem
            
            LEFT JOIN 
                Container b ON b.idContainerPai = a.idContainer
            LEFT JOIN 
                TipoContainer bb ON bb.idTipoContainer = b.idTipoContainer
            LEFT JOIN 
                Item bbb ON bb.idItem = bbb.idItem
            
            LEFT JOIN 
                Container c ON c.idContainerPai = b.idContainer
            LEFT JOIN 
                TipoContainer cc ON cc.idTipoContainer = c.idTipoContainer
            LEFT JOIN 
                Item ccc ON cc.idItem = ccc.idItem
            
            WHERE 
                a.idEnvio = ${idEnvio} and ${whereClause}
        )

        select dados = isnull(
            (SELECT 
                trim(descA) AS Descricao,
                idContainer,
                idTipoContainer,
                nContainerA as nContainer,
                ordemA as ordem,
                altura as altura,
                subContainer = ISNULL((
                    SELECT 
                        trim(descB) AS Descricao,
                        idCTb AS idContainer,
                        idTb as idTipoContainer,
                        nContainerB as nContainer,
                        ordemB as ordem,
                        alturaB as altura,
                        conteudo = ISNULL((
                                    SELECT 
                                        d.idItem,
                                        d.idConteudo,
                                        trim(isnull(ItemTraduzido.descItem, dd.Descricao)) AS Descricao,
                                        d.op,
                                        trim(Op.modelo) AS modelo,
                                        trim(Op.modeloDesc) AS modeloDesc,
                                        trim(Op.cor) as cor,
                                        trim(Op.pedido) as pedido,
                                        trim(Op.norma) as norma,
                                        d.tam,
                                        d.qtt,
                                        trim(isnull(u.descItem,Unidades.descricaoUnidade)) AS descUnidade,
                                        d.peso
                                    FROM 
                                        Conteudo d
                                    JOIN 
                                        Item dd ON d.idItem = dd.idItem
                                    LEFT JOIN 
                                        ItemTraduzido on dd.idItem = ItemTraduzido.idItem and ItemTraduzido.idIdioma =2
                                    JOIN 
                                        Op ON d.op = Op.op
                                    JOIN 
                                        OpTamanho ddd ON d.op = ddd.op AND d.tam = ddd.tam
                                    JOIN 
                                        Unidades on d.idUnidades = Unidades.idUnidades
                                    LEFT JOIN
                                        ItemTraduzido u on Unidades.idItem = u.idItem and u.idIdioma =2
                                    WHERE 
                                        d.idContainer = b1.idB
                                    ORDER BY 
                                        ddd.ordem
                                    FOR JSON PATH
                                ), '[]'),
                        subContainer = ISNULL((
                            SELECT 
                                trim(descC) AS Descricao,
                                idC As idContainer,
                                idTc as idTipoContainer,
                                nContainerC as nContainer,
                                ordemC as ordem,
                                alturaC as altura,
                                conteudo = ISNULL((
                                    SELECT
                                        d.idItem,
                                        d.idConteudo,
                                        trim(isnull(ItemTraduzido.descItem, dd.Descricao)) AS Descricao,
                                        d.op,
                                        trim(Op.modelo) AS modelo,
                                        trim(Op.modeloDesc) AS modeloDesc,
                                        trim(Op.cor) as cor,
                                        trim(Op.pedido) as pedido,
                                        trim(Op.norma) as norma,
                                        d.tam,
                                        d.qtt,
                                        trim(isnull(u.descItem,Unidades.descricaoUnidade)) AS descUnidade,
                                        d.peso
                                    FROM 
                                        Conteudo d
                                    JOIN 
                                        Item dd ON d.idItem = dd.idItem
                                    LEFT JOIN 
                                        ItemTraduzido on dd.idItem = ItemTraduzido.idItem and ItemTraduzido.idIdioma = 2
                                    JOIN 
                                        Op ON d.op = Op.op
                                    JOIN 
                                        OpTamanho ddd ON d.op = ddd.op AND d.tam = ddd.tam
                                    JOIN 
                                        Unidades on d.idUnidades = Unidades.idUnidades
                                    LEFT JOIN
                                        ItemTraduzido u on Unidades.idItem = u.idItem and u.idIdioma =2
                                    WHERE 
                                        d.idContainer = c1.idC
                                    ORDER BY 
                                        ddd.ordem
                                    FOR JSON PATH
                                ), '[]')
                            FROM 
                                ContainerHierarchy c1
                            WHERE 
                                c1.idB = b1.idB
                            GROUP BY 
                                c1.idC, idC, idTc, descC, nContainerC, ordemC, alturaC
                            FOR JSON PATh
                        ), '[]')
                    FROM 
                        ContainerHierarchy b1
                    WHERE 
                        b1.idA = a1.idA
                    GROUP BY 
                        b1.idB, descB, idCTb, idTb, nContainerB, ordemB, alturaB
                    FOR JSON PATH
                ), '[]')
            FROM 
                ContainerHierarchy a1
            GROUP BY 
                a1.idA, descA, idContainer, idTipoContainer, idTipoContainer, nContainerA, ordemA, altura
            FOR JSON PATh)
        ,'[]') 
    `);

  if (!linhas || !linhas.dados) {
    return null;
  }

  const dados = JSON.parse(linhas.dados);

  //console.log("getContainersConteudoToPrintDb: ", JSON.stringify(dados));
  return dados as ListaParaImprimrirDto;
};
