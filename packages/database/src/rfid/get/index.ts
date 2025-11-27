import { PedidosDto, RfidPedidosReturn } from "@repo/tipos/rfid";
import sql from "sql-template-tag";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getRfidOpFornecedorDb = async (pedidos: PedidosDto) => {
  if (pedidos.length === 0) return [];

  let query = sql``;

  pedidos.forEach((pedido, index) => {
    //console.log("pedido", pedido);
    query = sql`${query}
    select 
	pedidos =
		isnull(
			(select 
				pedido =${pedido.pedido},
				dados = (isnull(
				(
					select 
						bo.obrano, 
						bo3.u_tpestamp, 
						bo.tabela2, 
						marca = trim(bi.marca), 
						design = trim(bi.design), 
						cor = trim(bi.cor), 
						qtt = sum(bi.qtt), 
						fornecedores = (isnull(
							(
								select 
									value  = fl.flstamp,
									label = trim(enc.nome)
								from 
									FMO_PHC..bo enc
								join 
									FMO_PHC..bi encLinhas on enc.bostamp = encLinhas.bostamp
								join 
									FMO_PHC..fl on enc.no = fl.no and enc.estab = fl.estab
								where 
									enc.ndos = 2 and 
									encLinhas.u_nocli = bo.obrano and 
									fl.nacional = 'MARROCOS'
								group by 
									fl.flstamp, enc.nome
								for json path
							)

						,'[]'))
					from 
						FMO_PHC..bo
					join 
						FMO_PHC..bo3 on bo.bostamp = bo3.bo3stamp
					join 
						FMO_PHC..bi on bo.bostamp = bi.bostamp
	
					where 
						bo.ndos = 1 and 
						(bo3.u_tpestamp like '%' + ${pedido.pedido} + '%')
					group by 
						bo.obrano, 
						bo3.u_tpestamp, 
						bo.tabela2, 
						bi.marca,
						bi.design, 
						bi.cor	
					for json path
				)
				,'[]'))
			for json path
			)		
		,'[]')`;
    if (index < pedidos.length - 1) {
      query = sql`${query} UNION ALL `;
    }
  });
  //console.log("query", query.text);
  //console.log("Values", query.values);
  const dados = await prismaEnvios.$queryRaw<{ pedidos: string }[]>(query);

  const parsed = dados.flatMap(
    (item) => JSON.parse(item.pedidos) as RfidPedidosReturn["pedidos"]
  );

  return parsed;
};
