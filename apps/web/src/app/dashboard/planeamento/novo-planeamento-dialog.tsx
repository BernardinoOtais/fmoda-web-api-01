"use client";

import { useQuery } from "@repo/trpc";
import { useMutation } from "@repo/trpc";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { colunasNovoPlaneamento } from "./_novo-via-op/colunas";
import { DataTable } from "./_novo-via-op/data-table";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTRPC } from "@/trpc/client";

type NovoPlaneamentoDialogProps = {
  novo?: string | string[] | undefined;
  idDestino?: string;
};

const NovoPlaneamentoDialog = ({
  novo,
  idDestino,
}: NovoPlaneamentoDialogProps) => {
  const router = useRouter();
  const trpc = useTRPC();

  const criaPlaneamentosMutation = useMutation(
    trpc.planeamento.postDePlaneamentos.mutationOptions({
      onSuccess: () => {
        toast.success("Dados inseridos..");
        router.push("/dashboard/planeamento", { scroll: false });
      },
      onError: () => {
        toast.error("Nada inserido..");
        router.push("/dashboard/planeamento", { scroll: false });
      },
    })
  );

  const [value, setValue] = useState(idDestino || "");

  const [posting, setPosting] = useState(false);

  const [rowSelection, setRowSelection] = useState({});

  const [maisQueUmaOP, setMaisQueUmaOp] = useState<boolean>(false);

  const { data, isLoading, isError } = useQuery({
    ...trpc.planeamento.getOpsEClientes.queryOptions(),
    enabled: novo === "true",
  });

  const selectedCount = Object.keys(rowSelection).length;
  const criaPlaneamentos = () => {
    setPosting(true);
    const opsForSchema = Object.keys(rowSelection)
      .map((key) => {
        const row = data?.ops[Number(key)];
        return row ? { op: Number(row.op) } : null;
      })
      .filter((item): item is { op: number } => item !== null);

    if (!opsForSchema.length) return; // sai se o array estiver vazio
    const dadosParaPost = { idDestino: value, ops: opsForSchema, maisQueUmaOP };
    criaPlaneamentosMutation.mutate(dadosParaPost);
    console.log("dadosParaPost ;", dadosParaPost);
  };

  const colunas = useMemo(
    () => colunasNovoPlaneamento(maisQueUmaOP, posting),
    [maisQueUmaOP, posting]
  );
  // Move navigation to useEffect
  useEffect(() => {
    if (isError) {
      router.push("/dashboard/planeamento", { scroll: false });
    }
  }, [isError, router]);

  if (isError || !data) return null;

  return (
    <Dialog
      open={novo === "true"}
      onOpenChange={(open) => {
        if (open) {
          router.push("/dashboard/planeamento?novo=true");
        } else {
          router.push("/dashboard/planeamento", { scroll: false });
        }
      }}
    >
      <DialogContent className="!w-2/3 !h-8/10 !sm:w-2/3 !sm:h-2/3 !max-w-[1080px] !max-h-[80vh]  flex flex-col !p-4 ">
        <DialogHeader className=" pb-0 flex-shrink-0">
          <DialogTitle>Novo Planeamento</DialogTitle>
          <DialogDescription>Cria novo Planeamento</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div>Loadin...</div>
        ) : (
          <>
            <div className="flex-1 min-h-0">
              <DataTable
                columns={colunas}
                data={data.ops}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                maisQueUmaOP={maisQueUmaOP}
                setMaisQueUmaOp={setMaisQueUmaOp}
                fornecedores={data.fornecedores}
                value={value}
                setValue={setValue}
                posting={posting}
              />
            </div>

            <DialogFooter className="">
              <Button
                disabled={selectedCount === 0 || value === "" || posting}
                onClick={criaPlaneamentos}
                className="relative cursor-pointer flex justify-center items-center"
              >
                {posting && (
                  <Loader2 className="absolute h-4 w-4 animate-spin text-current" />
                )}
                <span className={posting ? "opacity-0" : ""}>
                  {selectedCount === 0
                    ? "..."
                    : selectedCount === 1
                      ? "Novo Planeamento..."
                      : "Novos Planeamentos..."}
                </span>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NovoPlaneamentoDialog;
