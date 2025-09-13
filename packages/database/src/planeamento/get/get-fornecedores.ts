import { AutocompleteStringDto } from "@repo/tipos/comuns";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getFornecedoresBd = async (): Promise<
  AutocompleteStringDto[]
> => prismaEnvios.$queryRaw<{ value: string; label: string }[]>`
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
