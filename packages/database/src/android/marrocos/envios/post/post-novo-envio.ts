import { NomeEnvioPostSchema } from "@repo/tipos/android/marrocos/envios";
import z from "zod";

import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const postNovoEnvio = async (
  novoEnvio: z.infer<typeof NomeEnvioPostSchema>
) =>
  prismaAndroidMarrocos.$queryRaw`exec enviosMarrocosNovo ${novoEnvio.nomeEnvio}, ${novoEnvio.nomeUser}`;
