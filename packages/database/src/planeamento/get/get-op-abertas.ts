import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getOpAbertasDb = async () => {
  //throw new Error("Simulated failure for testing");
  const dados = await prismaEnvios.$queryRaw<
    {
      ref: string;
      design: string;
      fot: string;
      json_data: string;
    }[]
  >`
select 
    bi.ref,
    bi.design,
    foto = 'file:' + replace(replace(max(fref.u_imagem), '\PHC\', '\fotostratadas\op\'), '\', '/'),
    json_data = (
        select 
            bo.obrano,
            sum(bi2.qtt) as total_qtt
        from 
			FMO_PHC..bo bo
        join 
			FMO_PHC..bo2 bo2 on bo.bostamp = bo2.bo2stamp
        join 
			FMO_PHC..bi bi2 on bo.bostamp = bi2.bostamp
        where bo.ndos = 1
          and bo2.area = 'Marrocos '
          and bo.fechada = 0 
          and bo.tabela1 != 'amostra'
          and bi2.ref = bi.ref
          and bi2.design = bi.design
        group by bo.obrano
		order by 2
        for json path
    )
from 
	FMO_PHC..bo bo
join 
	FMO_PHC..bo2 bo2 on bo.bostamp = bo2.bo2stamp
join 
	FMO_PHC..fref fref on bo.fref = fref.fref
join 
	FMO_PHC..bi bi on bo.bostamp = bi.bostamp
where bo.ndos = 1
  and bo2.area = 'Marrocos '
  and bo.fechada = 0 
  and bo.tabela1 != 'amostra'
group
	by bi.ref, bi.design
order by 
	bi.ref, bi.design;
    `;

  return dados;
};
