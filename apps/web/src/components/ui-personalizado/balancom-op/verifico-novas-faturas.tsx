"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { IdBmOpEmTextoSchema } from "@repo/tipos/qualidade_balancom";
import { useMutation, useQueryClient } from "@repo/trpc";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

type VerificoNovasFaturasProps = {
  op: string;
  idBm: string;
};

//postVerificoNovaFaturas

const VerificoNovasFaturas = ({ op, idBm }: VerificoNovasFaturasProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate: faturas, isPending } = useMutation(
    trpc.qualidade_balancom_op.postVerificoNovaFaturas.mutationOptions({
      onError: () => {
        toast.error("Não foi possível actualizar as faturas...");
      },
      onSuccess: () => {
        toast.success("Faturas actualizadas...");
      },
      onSettled: () => {
        queryClient.invalidateQueries(
          trpc.qualidade_balancom_op.getBmDataViaId.queryOptions(idBm)
        );
      },
    })
  );
  const { handleSubmit } = useForm<z.infer<typeof IdBmOpEmTextoSchema>>({
    resolver: zodResolver(IdBmOpEmTextoSchema),
    defaultValues: {
      idBm,
      op,
    },
  });

  const onSubmit = async (value: z.infer<typeof IdBmOpEmTextoSchema>) => {
    const dadosParaPost = IdBmOpEmTextoSchema.safeParse(value);
    if (!dadosParaPost.success) return;

    faturas(dadosParaPost.data);
  };

  return (
    <>
      <form className="pt-3  mx-auto " onSubmit={handleSubmit(onSubmit)}>
        <Button
          disabled={isPending}
          type="submit"
          className="h-10 mx-auto cursor-pointer "
        >
          {"Insiro Novas Faturas..."}
        </Button>
      </form>
    </>
  );
};

export default VerificoNovasFaturas;
