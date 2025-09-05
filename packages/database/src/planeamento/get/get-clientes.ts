import { AutocompleteStringDto } from "@repo/tipos/comuns";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getClientesBd = async (): Promise<
  AutocompleteStringDto[]
> => prismaEnvios.$queryRaw<{ value: string; label: string }[]>`
select 
	distinct 
	value = bo.tabela2,
	label = bo.tabela2
from
	FMO_PHC..bo
where 
	ndos = 1  
order by 1`;
