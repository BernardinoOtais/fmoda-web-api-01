"use client";

import { useMutation, useQueryClient, useSuspenseQuery } from "@repo/trpc";
import { ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/trpc/client";

type OpsCompativesProps = {
  idBm: string;
};

const OpsCompatives = ({ idBm }: OpsCompativesProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery(
    trpc.qualidade_balancom_op.getOpsCompativeis.queryOptions(idBm)
  );

  const [isOpen, setIsOpen] = useState(false);

  const insiroOp = useMutation(
    trpc.qualidade_balancom_op.postNovaOp.mutationOptions({
      onError: () => {
        toast.error("Não foi possível inserir op...");
      },
      onSuccess: (data) => {
        if (data === "incompativel") {
          toast.error("Op Incompatível...");
        } else toast.success("Op inserida com sucesso...");
      },
      onSettled: () => {
        queryClient.invalidateQueries(
          trpc.qualidade_balancom_op.getBmDataViaId.queryOptions(idBm)
        );
        queryClient.invalidateQueries(
          trpc.qualidade_balancom_op.getOpsCompativeis.queryOptions(idBm)
        );
      },
    })
  );

  if (data?.length === 0) return null;
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mx-auto w-[300px]"
    >
      <div className="flex items-center justify-between gap-4 px-4 ">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Ops Compatíveis...
        </h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <ChevronsUpDown />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        <Table className="max-w-4xl min-w-2xs mx-auto w-48">
          <TableHeader className="bg-accent">
            <TableRow className="!border-0 border-none ">
              <TableHead className="border text-center w-24">Op</TableHead>
              <TableHead className="border text-center w-24">Qtt</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-xs">
            {data?.map((op) => {
              return (
                <TableRow
                  key={op.op}
                  className="!border-0 border-none !p-0 bg-transparent"
                >
                  <TableCell className="border text-center ">
                    <Button
                      variant="link"
                      className="h-6"
                      onClick={() => insiroOp.mutate({ op: op.op, idBm })}
                    >
                      {op.op}
                    </Button>
                  </TableCell>
                  <TableCell className="border text-center">{op.qtt}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default OpsCompatives;
