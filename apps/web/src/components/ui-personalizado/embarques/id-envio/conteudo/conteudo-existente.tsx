"use client";

import { ListaContudoDto } from "@repo/tipos/embarques_idenvio";
import { useMutation, useQueryClient } from "@repo/trpc";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConteudoCliente from "./conteudo-cliente";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/trpc/client";

type ConteudoExistenteProps = {
  idContainer: number;
  idEnvio: number;
  conteudos: ListaContudoDto | undefined;
  conteudosAgrupados: Record<
    number,
    {
      idItem: number;
      totalQtt: number;
      totalPeso: number;
      count: number;
    }
  >;
};

const ConteudoExistente = ({
  idContainer,
  idEnvio,
  conteudos,
  conteudosAgrupados,
}: ConteudoExistenteProps) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const [itensSelecionados, setItensSelecionados] = useState<number[]>([]);
  const [disabledApaga, setDisabledApaga] = useState(false);

  const totalPeso = conteudos?.reduce((acc, item) => acc + item.peso, 0) || 0;

  const apagaoConsteudos = useMutation(
    trpc.embarquesIdEnvio.deleteConteudos.mutationOptions({
      onSuccess: () => {
        toast.info(`Apagados correctament...`, {
          description: "Sucesso",
        });
      },
      onError: (error) => {
        toast.error("Erro inesperado ao apagar conteudos", {
          description:
            error instanceof Error ? error.message : "Erro desconhecido",
        });
      },
      onSettled: () => {
        setItensSelecionados([]);
        queryClient.invalidateQueries(
          trpc.embarquesIdEnvio.getConteudo.queryOptions({ id: idContainer })
        );
        setDisabledApaga(false);
      },
    })
  );

  const apagaConteudoFun = () => {
    setDisabledApaga(true);

    apagaoConsteudos.mutate({
      idEnvio,
      numbers: itensSelecionados,
    });
  };

  return (
    <>
      <Table className="max-w-[2000px] mx-auto ">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[70px]">Op</TableHead>
            <TableHead>Referência</TableHead>
            <TableHead>Cor</TableHead>
            <TableHead>NºCliente</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-center">Tamanho</TableHead>
            <TableHead className="text-center">Quantidade</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead>Peso Uni.(Kg)</TableHead>
            <TableHead>Peso T.(Kg)</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="text-xs">
          <ConteudoCliente
            conteudos={conteudos}
            conteudosAgrupados={conteudosAgrupados}
            itensSelecionados={itensSelecionados}
            setItensSelecionados={setItensSelecionados}
            disabledApaga={disabledApaga}
          />
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={9}>Peso Total:</TableCell>
            <TableCell className="text-center">
              {totalPeso.toFixed(5)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {itensSelecionados.length > 0 && (
        <Button
          className="w-full p-1"
          variant="destructive"
          disabled={disabledApaga}
          onClick={() => apagaConteudoFun()}
        >
          {disabledApaga && <Loader2 className="animate-spin" />} Apagar
          Conteudo
        </Button>
      )}
    </>
  );
};

export default ConteudoExistente;
