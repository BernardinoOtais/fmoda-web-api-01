import { ContainerDto } from "@repo/tipos/embarques_idenvio";
import { useMutation, useQueryClient } from "@repo/trpc";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { parsePositiveInt } from "@/lib/my-utils";
import { useTRPC } from "@/trpc/client";

type InputOpProps = {
  idEnvio: number;
  container: ContainerDto;
  setScroll: (data: boolean) => void;
};
const InputOp = ({ idEnvio, container, setScroll }: InputOpProps) => {
  const chave = {
    id: idEnvio,
    idd: container.idContainerPai || undefined,
  };

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [raw, setRaw] = useState("");

  const [lastSubmitted, setLastSubmitted] = useState<number | null>(null);

  const debounced = useDebounce(raw, 1250);

  const insiroOp = useMutation(
    trpc.insiroOpEmContainer.mutationOptions({
      onSuccess: () => {
        toast.success(`OP inserida com sucesso...`);
        queryClient.invalidateQueries(trpc.getContainers.queryOptions(chave));
      },
      onSettled: () => {
        setRaw("");
      },
      onError: (error) => {
        toast.error(error.message || "Erro ao inserir Op...");
      },
    })
  );

  useEffect(() => {
    if (debounced === "") return;

    const num = parsePositiveInt(debounced);
    if (num === false || num === lastSubmitted || lastSubmitted !== null) {
      setRaw("");
      return;
    }

    if (num === lastSubmitted) return; // Don't resend the same number

    setScroll(false);
    setLastSubmitted(num);

    insiroOp.mutate({
      PostOp: {
        op: num,
        id: container.idContainer,
      },
    });
  }, [debounced, container.idContainer, insiroOp, setScroll, lastSubmitted]);

  const isSavingOp = insiroOp.isPending;
  return (
    <div className="relative">
      {isSavingOp && (
        <div className="bg-opacity-60 absolute inset-0 z-10 flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}

      <div className="flex w-24 flex-col items-center justify-start">
        <span>Op</span>

        <Input
          className="w-16 text-center"
          placeholder="..."
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          disabled={isSavingOp}
        />
      </div>
    </div>
  );
};

export default InputOp;
