import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const dadosPartesAndroid = async () => {
  //throw new Error("Simulated failure for testing");
  const dados = await prismaEnvios.$queryRaw<
    {
      idParte: number;
      descricaoParte: string;
      descricaoParteFrances: string;
    }[]
  >`
        select 
	        a.idParte, a.descricaoParte, a.descricaoParteFrances
        from 
            Oapptorta..EnviosMarrocosPartesPecas a
        left join 
            ligacaoAndroid b on a.idParte = b.idParte
        where 
            b.idParte is null`;

  return dados;
};
