import { AutocompleteStringDto } from "@repo/tipos/comuns";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getClientesBd = async (): Promise<
  AutocompleteStringDto[]
> => prismaQualidade.$queryRaw<{ value: string; label: string }[]>`
select 
	distinct 
	value = bo.tabela2,
	label = bo.tabela2
from
	FMO_PHC..bo
where 
	ndos = 1  
order by 1`;
