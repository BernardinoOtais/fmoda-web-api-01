import { IdNumeroInteiroNaoNegativoDto } from "@repo/tipos/comuns";
import { useMutation, useQueryClient } from "@repo/trpc";

import { useTRPC } from "@/trpc/client";

export function useReordenaContainer(chave: IdNumeroInteiroNaoNegativoDto) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const codigoTRPC = trpc.getContainers.queryKey(chave);
  return useMutation(
    trpc.postOrdenaContainer.mutationOptions({
      onMutate: async () => {
        await queryClient.cancelQueries(trpc.getContainers.queryOptions(chave));

        const previousContainers = queryClient.getQueryData(codigoTRPC);

        return { previousContainers };
      },
      onSettled() {
        queryClient.invalidateQueries(trpc.getContainers.queryOptions(chave));
      },
    })
  );
}
