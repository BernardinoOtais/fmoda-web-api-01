import { NumeroOuZero } from "@repo/tipos/comuns";
import { ContainerDto } from "@repo/tipos/embarques_idenvio";
import { useMutation, useQueryClient } from "@repo/trpc";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

type InputAlturaProps = {
  idEnvio: number;
  container: ContainerDto;
  setScroll: (data: boolean) => void;
};

const InputAltura = ({ idEnvio, container, setScroll }: InputAlturaProps) => {
  const chave = {
    id: idEnvio,
    idd: container.idContainerPai || undefined,
  };
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const codigoTRPC = trpc.embarquesIdEnvio.getContainers.queryKey(chave);
  const data = queryClient.getQueryData(codigoTRPC);

  const alturaOriginal = data?.containers.find(
    (c) => c.idContainer === container.idContainer
  )?.altura;

  const [raw, setRaw] = useState(alturaOriginal?.toString() ?? "");

  const debounced = useDebounce(raw, 1250);

  const [erro, setErro] = useState(false);

  const insiroAltura = useMutation(
    trpc.embarquesIdEnvio.postAlturaContrainer.mutationOptions({
      onMutate: async (data) => {
        await queryClient.cancelQueries(
          trpc.embarquesIdEnvio.getContainers.queryOptions(chave)
        );

        const previousData = queryClient.getQueryData(codigoTRPC);

        queryClient.setQueryData(codigoTRPC, (old: typeof previousData) =>
          old
            ? {
                ...old,
                containers: old.containers.map((c) => ({
                  ...c,
                  altura:
                    c.idContainer === container.idContainer
                      ? (data.PostAltura.altura as number)
                      : c.altura,
                })),
              }
            : old
        );

        return { previousData };
      },
      onError: (_error, _updatedEnvio, context) => {
        setErro(true);
        toast.error(_error.message || "Erro inserir altura...");
        if (context?.previousData) {
          queryClient.setQueryData(codigoTRPC, context.previousData);

          const valorAnteriorAoErro = context.previousData.containers.find(
            (c) => c.idContainer === container.idContainer
          )?.altura;

          setRaw(valorAnteriorAoErro?.toString() ?? "");
        }
      },

      onSettled: () => {
        queryClient.invalidateQueries(
          trpc.embarquesIdEnvio.getContainers.queryOptions(chave)
        );
      },
      onSuccess: (data) => {
        if (data.altura === 0 && raw !== "0") setRaw(data.altura.toString());
        toast.success(`Altura inserida com sucesso...`);
      },
    })
  );

  useEffect(() => {
    setErro(false);
  }, [debounced]);

  useEffect(() => {
    const parsed = NumeroOuZero.safeParse(debounced);

    if (!parsed.success) return;

    const novo = parsed.data;

    if (alturaOriginal === undefined || novo === alturaOriginal || erro) return;

    setScroll(false);

    insiroAltura.mutate({
      PostAltura: {
        id: container.idContainer,
        altura: novo,
      },
    });
  }, [
    alturaOriginal,
    container.idContainer,
    debounced,
    erro,
    insiroAltura,
    setScroll,
  ]);

  const isSavingAltura = insiroAltura.isPending;

  return (
    <div className="relative">
      {isSavingAltura && (
        <div className="bg-opacity-60 absolute inset-0 z-10 flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}

      <div className="flex w-24 flex-col items-center justify-start">
        <span>Altura em Mt</span>

        <Input
          className="w-16 text-center"
          placeholder="..."
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          disabled={isSavingAltura}
        />
      </div>
    </div>
  );
};

export default InputAltura;
