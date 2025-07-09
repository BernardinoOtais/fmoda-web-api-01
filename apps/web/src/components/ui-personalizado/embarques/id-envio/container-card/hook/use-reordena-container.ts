import { IdNumeroInteiroNaoNegativoDto } from "@repo/tipos/comuns";
import { useMutation, useQueryClient } from "@repo/trpc";

import { useTRPC } from "@/trpc/client";

export function useReordenaContainer(chave: IdNumeroInteiroNaoNegativoDto) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const codigoTRPC = trpc.embarquesIdEnvio.getContainers.queryKey(chave);
  return useMutation(
    trpc.embarquesIdEnvio.postOrdenaContainer.mutationOptions({
      onMutate: async () => {
        await queryClient.cancelQueries(
          trpc.embarquesIdEnvio.getContainers.queryOptions(chave)
        );

        const previousContainers = queryClient.getQueryData(codigoTRPC);

        return { previousContainers };
      },
      onSettled() {
        queryClient.invalidateQueries(
          trpc.embarquesIdEnvio.getContainers.queryOptions(chave)
        );
      },
    })
  );
}
