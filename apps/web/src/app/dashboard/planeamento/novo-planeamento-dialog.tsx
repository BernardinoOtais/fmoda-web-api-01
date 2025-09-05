"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PosNovoPlaneamentoDto,
  PosNovoPlaneamentoSchema,
} from "@repo/tipos/planeamento";
import { useSuspenseQuery } from "@repo/trpc";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";
import { DataTable } from "./_novo-via-op/data-table";
import { colunas } from "./_novo-via-op/colunas";

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

  const { data } = useSuspenseQuery(
    trpc.planeamento.getOpsEClientes.queryOptions()
  );

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
      <DialogContent className="!w-2/3 !h-2/3 !sm:w-2/3 !sm:h-2/3 !max-w-[1080px] !max-h-[60vh] !p-0 min-w-[500px] flex flex-col">
        <DialogHeader className="p-6 pb-0 flex-shrink-0">
          <DialogTitle>Novo Planeamento</DialogTitle>
          <DialogDescription>Cria novo Planeamento</DialogDescription>
        </DialogHeader>

        {/* Force specific height calculation */}
        <div
          className="flex-1 overflow-auto p-6"
          style={{
            maxHeight: "calc(100% - 120px)", // Subtract header + footer height
          }}
        >
          <DataTable columns={colunas} data={data.ops} />
        </div>

        <DialogFooter className="p-6 pt-0 flex-shrink-0">
          <Button>Cenas</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovoPlaneamentoDialog;
