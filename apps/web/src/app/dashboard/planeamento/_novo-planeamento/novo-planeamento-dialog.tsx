"use client";
import { useMutation } from "@repo/trpc";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { usePlaneamentoContext } from "./contex-provider-novo-planeamento";
import DataTableWrapper from "./novo-via-op/data-table-wrapper";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTRPC } from "@/trpc/client";

type NovoPlaneamentoDialogProps = {
  novo?: string | string[] | undefined;
};

const NovoPlaneamentoDialog = ({ novo }: NovoPlaneamentoDialogProps) => {
  const router = useRouter();
  const trpc = useTRPC();

  const { menus, titulo, idDestino, posting, setPosting, state } =
    usePlaneamentoContext();

  const criaPlaneamentos = () => {
    setPosting(true);

    const ops = state["op"];
    if (!ops) return;

    if (ops.opsForSchema.length) return;
    const dadosParaPost = {
      idDestino,
      ops: ops.opsForSchema,
      maisQueUmaOP: ops.maisQueUmaOP,
    };
    //criaPlaneamentosMutation.mutate(dadosParaPost);
  };

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

  const stateOp = state["op"];
  const selectedCount = stateOp?.opsForSchema.length;

  const renderContent = (tab: string) => {
    switch (tab) {
      case "op":
        return <DataTableWrapper />;
      case "orc":
        return <div>222</div>;
      case "livre":
        return <div>333</div>;
      default:
        return <div>Selecione uma opção válida.</div>;
    }
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
      <DialogContent className="!w-2/3 !h-8/10 !sm:w-2/3 !sm:h-2/3 !max-w-[1080px] !max-h-[80vh]  flex flex-col !p-4 ">
        <DialogDescription>Criar novo Planeamento..</DialogDescription>
        <DialogHeader className=" pb-0 flex-shrink-0">
          <DialogTitle>{titulo}</DialogTitle>
        </DialogHeader>
        <Tabs className="!flex-1 !min-h-0 ">
          <TabsList className="grid w-full grid-cols-3">
            {menus.map((dado) => (
              <TabsTrigger key={dado.chave} value={dado.chave} asChild>
                <Link href={`?novo=true&tab=${dado.chave}`} scroll={false}>
                  {dado.nome}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>

          {menus.map((dado) => (
            <TabsContent
              key={dado.chave}
              value={dado.chave}
              className="flex-1 min-h-0 flex-col"
            >
              {renderContent(dado.chave)}
            </TabsContent>
          ))}
        </Tabs>
        <DialogFooter className="">
          {stateOp && (
            <Button
              disabled={selectedCount === 0 || idDestino === "" || posting}
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
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovoPlaneamentoDialog;
