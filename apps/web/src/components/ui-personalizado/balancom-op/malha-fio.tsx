import { BmMalhasFio } from "@repo/tipos/qualidade_balancom";
import { ChevronDown } from "lucide-react";
import React, { Fragment, useState } from "react";
import { z } from "zod";

import InputDefeitosFio from "./inputs-e-botoes-das-malhas/input-defeitos-fio";
import InputLotesFio from "./inputs-e-botoes-das-malhas/input-lotes-fio";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNCasasDecimais } from "@/lib/my-utils";

type MalhaFioProps = {
  fio: z.infer<typeof BmMalhasFio>;
  idBm: string;
  op: number;
};
const MalhaFio = ({ fio, idBm, op }: MalhaFioProps) => {
  const [openRow, setOpenRow] = useState<string | null>(null);
  //console.log("Fio : ", JSON.stringify(fio, null, 2));
  const totalMalha =
    fio?.reduce((total, item) => {
      return total + item.qtdeEntrada - item.sobras - item.defeitosStock;
    }, 0) || 0;

  return (
    <Table className="max-w-4xl mx-auto ">
      <TableHeader className="bg-accent">
        <TableRow className="!border-0 border-none">
          <TableHead className="border text-center">Material</TableHead>
          <TableHead className="border text-center">
            Fornecedor/Pedidos
          </TableHead>
          <TableHead className="border text-center">Qtde Pedida</TableHead>
          <TableHead className="border text-center">Qtde Entrada</TableHead>
          <TableHead className="border text-center">Qtde Saída</TableHead>
          <TableHead className="border text-center">Lote</TableHead>
          <TableHead className="border text-center">Qtde Sobras</TableHead>
          <TableHead className="border text-center">Qtde Defeitos</TableHead>
          <TableHead className="border text-center">Qtde Usada</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-xs">
        {fio?.map((fioR) => {
          const dadosFornecedoresPedidos =
            fioR.BmOpsPorMalhaFio?.flatMap((movimentos) =>
              movimentos.BmMalhasFioMovimentos?.map((lote) => ({
                idBm: lote.idBm,
                ref: lote.ref,
                unidade: lote.unidade,
                op: lote.op,
                idBmMovimentosLote: lote.idBmMovimentosLote,
                idMovimento: lote.idMovimento,
                nMovimento: lote.nMovimento,
                nome: lote.nome.trim(),
                idTipo: lote.idTipo,
                tipo: lote.tipo,
                qtt: lote.qtt,
                lote: lote.lote,
              })),
            ) || [];

          const qtdeTotalLinha =
            fioR.qtdeEntrada - fioR.sobras - fioR.defeitosStock;
          return (
            <Fragment key={fioR.refOrigem}>
              {openRow === fioR.refOrigem &&
                fioR.BmOpsPorMalhaFio?.map((op) =>
                  op.BmMalhasFioMovimentos?.filter(
                    (l) =>
                      l.idTipo === 14 ||
                      l.idTipo === 9 ||
                      l.idTipo === 118 ||
                      l.idTipo === 16,
                  ).map((lote) => (
                    <TableRow
                      key={`${op.op}-${lote.idBmMovimentosLote}`}
                      className="!border-0 border-none !p-0 bg-transparent"
                    >
                      <TableCell className="border text-center" colSpan={1}>
                        {lote.tipo}
                      </TableCell>
                      <TableCell className="border text-center" colSpan={1}>
                        {lote.obranome === "" ? lote.nMovimento : lote.obranome}
                      </TableCell>
                      <TableCell
                        className="border text-center"
                        colSpan={1}
                      ></TableCell>
                      <TableCell className="border text-center" colSpan={1}>
                        {lote.qtt > 0 ? lote.qtt : ""}
                      </TableCell>
                      <TableCell className="border text-center" colSpan={1}>
                        {lote.qtt < 0 ? lote.qtt : ""}
                      </TableCell>
                      <TableCell
                        className="border text-center"
                        colSpan={4}
                      ></TableCell>
                    </TableRow>
                  )),
                )}
              <TableRow>
                <TableCell
                  className="border text-center cursor-pointer hover:bg-muted transition-colors"
                  onClick={() =>
                    setOpenRow((prev) =>
                      prev === fioR.refOrigem ? null : fioR.refOrigem,
                    )
                  }
                >
                  <div className="flex items-center justify-between w-full">
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openRow === fioR.refOrigem ? "rotate-180" : ""
                      }`}
                    />
                    <span className="text-right">{fioR.fio}</span>
                  </div>
                </TableCell>
                <TableCell className="border text-center">
                  {fornecedoresPedidos(dadosFornecedoresPedidos)}
                </TableCell>
                <TableCell className="border text-center">
                  {fioR.qtdePedida}
                </TableCell>
                <TableCell className="border text-center">
                  {fioR.qttEntrou}
                </TableCell>
                <TableCell className="border text-center">
                  {fioR.qttSaiu}
                </TableCell>
                <TableCell className="border text-center">
                  <InputLotesFio
                    op={op}
                    idBm={idBm}
                    ref={fioR.ref}
                    refOrigem={fioR.refOrigem}
                    texto={fioR.lote}
                  />
                </TableCell>
                <TableCell className="border text-center">
                  {fioR.sobras}
                </TableCell>
                <TableCell className="border text-center">
                  <InputDefeitosFio
                    idBm={idBm}
                    ref={fioR.ref}
                    refOrigem={fioR.refOrigem}
                    defeitosStock={fioR.defeitosStock}
                  />
                </TableCell>
                <TableCell className="border text-center">
                  {formatNCasasDecimais(qtdeTotalLinha, 3)}
                </TableCell>
              </TableRow>
            </Fragment>
          );
        })}
        <TableRow>
          <TableCell className="border text-left" colSpan={7}>
            Total
          </TableCell>
          <TableCell className="border text-center">
            {formatNCasasDecimais(totalMalha, 4)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default MalhaFio;

const fornecedoresPedidos = (
  pedidosCompra: (
    | {
        idBm: string;
        ref: string;
        unidade: string;
        op: number;
        idBmMovimentosLote: string;
        idMovimento: string;
        nMovimento: number;
        nome: string;
        idTipo: number;
        tipo: string;
        qtt: number;
        lote: string;
      }
    | undefined
  )[],
) => {
  type Result = {
    [key: string]: number[];
  };

  const result: Result = {};

  pedidosCompra.forEach((item) => {
    if (item && item.idTipo === 2) {
      const { nome, nMovimento } = item;
      if (!result[nome]) {
        result[nome] = [];
      }
      result[nome].push(nMovimento);
    }
  });

  return (
    <div>
      {Object.entries(result).map(([nome, nCompras]) => (
        <div className="flex flex-col items-center justify-center" key={nome}>
          <span className="text-xs">{nome}</span>
          <span className="text-xs">{nCompras.join(", ")}</span>
        </div>
      ))}
    </div>
  );
};
