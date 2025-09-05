"use client";

import { useSuspenseQuery } from "@repo/trpc";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { colunas } from "./_novo-via-op/colunas";
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
  const [rowSelection, setRowSelection] = useState({});

  const router = useRouter();
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.planeamento.getOpsEClientes.queryOptions()
  );
  const selectedCount = Object.keys(rowSelection).length;

  const criaPlaneamentos = () => {
    const selectedRows = Object.keys(rowSelection)
      .map((key) => data.ops[Number(key)])
      .filter(Boolean);
    console.log("Selection :", selectedRows);
  };
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
      <DialogContent className="!w-2/3 !h-8/10 !sm:w-2/3 !sm:h-2/3 !max-w-[1080px] !max-h-[80vh] min-w-[500px] flex flex-col !p-2 ">
        <DialogHeader className=" pb-0 flex-shrink-0">
          <DialogTitle>Novo Planeamento</DialogTitle>
          <DialogDescription>Cria novo Planeamento</DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <DataTable
            columns={colunas}
            data={data.ops}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        </div>

        <DialogFooter className="">
          <Button
            disabled={selectedCount === 0}
            onClick={criaPlaneamentos}
            className=""
          >
            {selectedCount === 0
              ? "..."
              : selectedCount === 1
                ? "Novo Planeamento..."
                : "Novos Planeamentos..."}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovoPlaneamentoDialog;
