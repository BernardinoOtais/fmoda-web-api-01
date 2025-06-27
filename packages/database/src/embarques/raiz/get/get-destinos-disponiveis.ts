import { prismaEnvios } from "@/prisma-servicos/envios/envios";
import { AutocompleteStringDto } from "@repo/tipos/comuns";

export const getDestinosDisponiveisBd = async (): Promise<
  AutocompleteStringDto[]
> =>
  await prismaEnvios.$queryRaw<{ value: string; label: string }[]>`
    SELECT 
      idDestino AS value, 
      nomeDestino AS label 
    FROM 
      Destinos`;
