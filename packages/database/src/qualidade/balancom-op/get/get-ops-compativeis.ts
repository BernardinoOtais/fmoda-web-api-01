import { listaOpsSchema } from "@repo/tipos/qualidade_balancom";
import sql from "sql-template-tag";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getOpsCompativeisBd = async (idBm: string) =>
  prismaQualidade
    .$queryRaw<{ op: number; qtt: number }[]>(
      sql`
    select
        op = bi.obrano , qtt = sum(bi.qtt) 
    from 
        FMO_PHC..bi
    where 
        bi.ndos = 1 and
        bi.ref = (
            select 
                top 1 enc.ref 
            from 
                FMO_PHC..bi enc 
            where 
                enc.ndos = 1 and 
                enc.obrano = (
                    select 
                        top 1 op 
                    from
                        BmOp 
                    where 
                        idBm = ${idBm}
                    )
            )
        and bi.obrano not in (
            select  
                op 
            from 
                BmOp 
            where idBm = ${idBm})
    group by
        bi.obrano
`
    )
    .then((raw) => listaOpsSchema.parse(raw));
