import { AutocompleteStringDto } from "@repo/tipos/comuns";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getFornecedoresBd = async (): Promise<
  AutocompleteStringDto[]
> => prismaQualidade.$queryRaw<{ value: string; label: string }[]>`
select 
    distinct 
    value = trim(fl.flstamp),
    label = trim(fl.nome)
from
    FMO_PHC..fl
where 
    estab = 1 and
    nacional != 'PORTUGAL'
order by 1`;
