import { PostNovaPaleteSchema } from "@repo/tipos/android/marrocos/paletes";
import z from "zod";

import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const postPalete = async (
  dados: z.infer<typeof PostNovaPaleteSchema>
) => {
  const { idEnvioMarrocos, nomeUser } = dados;

  // ✅ Escape the string value to prevent SQL injection
  const safeNomeUser = nomeUser.replace(/'/g, "''");

  const query = `EXEC enviosMarrocosNovoPalete ${idEnvioMarrocos}, '${safeNomeUser}'`;

  // ✅ Use $queryRawUnsafe because you're manually interpolating
  return await prismaAndroidMarrocos.$queryRawUnsafe(query);
};
