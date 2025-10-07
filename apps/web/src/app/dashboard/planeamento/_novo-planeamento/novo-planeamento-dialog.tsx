"use client";

import { useMutation } from "@repo/trpc";
import { useQuery } from "@repo/trpc";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { colunasNovoPlaneamento } from "./novo-via-op/colunas";
import { DataTable } from "./novo-via-op/data-table";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTRPC } from "@/trpc/client";

const dados = [
  {
    chave: "op",
    nome: "Cria Planeamentos por Op",
    desc: "Aqui pode criar planeamentos via Op...",
  },
  {
    chave: "orc",
    nome: "Cria Planeamentos via Orçamento",
    desc: "Aqui pode criar planeamentos via Orçamento...",
  },
  {
    chave: "livre",
    nome: "Cria Planeamentos Livres",
    desc: "Aqui pode criar planeamentos Livres...",
  },
];

type NovoPlaneamentoDialogProps = {
  novo?: string | string[] | undefined;
  idDestino?: string;
  tab: string | string[] | undefined;
};

const NovoPlaneamentoDialog = ({
  novo,
  idDestino,
  tab,
}: NovoPlaneamentoDialogProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  //novo planeamento via op
  const [rowSelection, setRowSelection] = useState({});
  const selectedCount = Object.keys(rowSelection).length;
  const [posting, setPosting] = useState(false);
  const [value, setValue] = useState(idDestino || "");

  const [maisQueUmaOP, setMaisQueUmaOp] = useState<boolean>(false);

  const colunas = useMemo(
    () => colunasNovoPlaneamento(maisQueUmaOP, posting),
    [maisQueUmaOP, posting]
  );

  const { data, isLoading, isError } = useQuery({
    ...trpc.planeamento.getOpsEClientes.queryOptions(),
    enabled: novo === "true",
  });

  const criaPlaneamentos = () => {
    setPosting(true);
    const opsForSchema = Object.keys(rowSelection)
      .map((key) => {
        const row = data?.ops[Number(key)];
        return row ? { op: Number(row.op) } : null;
      })
      .filter((item): item is { op: number } => item !== null);

    if (!opsForSchema.length) return;
    const dadosParaPost = { idDestino: value, ops: opsForSchema, maisQueUmaOP };
    criaPlaneamentosMutation.mutate(dadosParaPost);
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

  useEffect(() => {
    if (isError) {
      router.push("/dashboard/planeamento", { scroll: false });
    }
  }, [isError, router]);
  //novo planeamento via op

  const tabParam = Array.isArray(tab) ? tab[0] : tab || "op";
  const tabRecebida = dados.some((dado) => dado.chave === tabParam)
    ? tabParam
    : "op";

  const renderContent = (tab: string) => {
    switch (tab) {
      case "op":
        return isLoading ? (
          <div>loading...</div>
        ) : !isError && data ? (
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
        ) : (
          <div>erro...</div>
        );
      case "orc":
        return <div>222</div>;
      case "livre":
        return <div>333</div>;
      default:
        return <div>⚠ Selecione uma opção válida.</div>;
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
        <DialogHeader className=" pb-0 flex-shrink-0">
          <DialogTitle>
            {dados.find((c) => c.chave === tabRecebida)?.desc}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={tabRecebida} className="!flex-1 !min-h-0 ">
          <TabsList className="grid w-full grid-cols-3">
            {dados.map((dado) => (
              <TabsTrigger key={dado.chave} value={dado.chave} asChild>
                <Link href={`?novo=true&tab=${dado.chave}`}>{dado.nome}</Link>
              </TabsTrigger>
            ))}
          </TabsList>

          {dados.map((dado) => (
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
      </DialogContent>
    </Dialog>
  );
};

export default NovoPlaneamentoDialog;
