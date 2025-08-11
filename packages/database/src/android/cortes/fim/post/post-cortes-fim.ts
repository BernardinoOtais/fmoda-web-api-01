import { prismaAndroidCortes } from "@/prisma-servicos/android/cortes/android-cortes-client";

export const postCortesFim = async (
  faseLinx: string,
  idEnvio: number,
  ip: string,
  nLotes: number,
  nomeUser: string,
  recursoLinx: string,
  sectorLinx: string
) =>
  prismaAndroidCortes.$queryRaw`exec enviaEnvioComLote ${idEnvio}, ${faseLinx}, ${sectorLinx}, ${recursoLinx}, ${nomeUser}, ${ip}, ${nLotes}`;
