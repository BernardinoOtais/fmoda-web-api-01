"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { Fragment } from "react";

import BotaoApagaMalha from "./inputs-e-botoes-das-malhas/botao-apaga-malha";
import InputDefeitos from "./inputs-e-botoes-das-malhas/input-defeitos";
import InputLotes from "./inputs-e-botoes-das-malhas/input-lotes";
import MalhaFio from "./malha-fio";
import { fornecedoresPedidos } from "../meus-components/fornecedores-pedidos";
import InputQuantidadeSeUnidade from "./inputs-e-botoes-das-malhas/input-quantidade-se-unidade";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNCasasDecimais } from "@/lib/my-utils";
import { useTRPC } from "@/trpc/client";

type MalhaProps = { idBm: string; op: number };

const Malha = ({ idBm, op }: MalhaProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.qualidade_balancom_op.getBmDataViaId.queryOptions(idBm)
  );

  const malhas = data?.BmMalhas;
  const total =
    malhas?.reduce((total, item) => {
      return (
        total +
        (item.BmMalhasFio && item.BmMalhasFio?.length > 0
          ? item.BmMalhasFio.reduce((totalF, itemF) => {
              return (
                totalF + itemF.qtdeEntrada - itemF.sobras - itemF.defeitosStock
              );
            }, 0)
          : (item.unidade === "Un"
              ? (item.qtdeEntradaSeUnidade || 0) * item.qtdeEntrada
              : item.qtdeEntrada) -
            item.sobras -
            item.defeitosStock)
      );
    }, 0) ?? 0;
  return (
    <>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mx-auto">
        Malhas
      </h3>
      <div>
        <Table className="max-w-4xl mx-auto ">
          <TableHeader className="bg-accent">
            <TableRow className="!border-0 border-none">
              <TableHead className="border text-center">{`Material`}</TableHead>
              <TableHead className="border text-center">
                Fornecedor/Pedidos
              </TableHead>
              <TableHead className="border text-center">Qtde Pedida</TableHead>
              <TableHead className="border text-center">Qtde Entrada</TableHead>
              <TableHead className="border text-center">Lote</TableHead>
              <TableHead className="border text-center">Qtde Sobras</TableHead>
              <TableHead className="border text-center">
                Qtde Defeitos
              </TableHead>
              <TableHead className="border text-center">Qtde Usada</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-xs">
            {malhas?.map((malha) => {
              const dadosFornecedoresPedidos =
                malha.BmOpsPorMalha?.flatMap((movimentos) =>
                  movimentos.BmMovimentosLotes?.map((lote) => ({
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
                  }))
                ) || [];

              const qtdeTotalLinha =
                (malha.unidade === "Un"
                  ? malha.qtdeEntrada * (malha.qtdeEntradaSeUnidade || 0)
                  : malha.qtdeEntrada) -
                malha.sobras -
                malha.defeitosStock;

              const mostraBotaoApagaMalhaEmenosDeOitoPercentagem =
                total > 0 && qtdeTotalLinha / total <= 0.08;
              if (malha.BmMalhasFio && malha.BmMalhasFio.length > 0) {
                return (
                  <Fragment key={malha.ref}>
                    <TableRow className="">
                      <TableCell colSpan={8} className="text-center border">
                        {malha.malha}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={8} className="border">
                        <MalhaFio fio={malha.BmMalhasFio} idBm={idBm} op={op} />
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              }

              return (
                <TableRow
                  key={malha.ref}
                  className="!border-0 border-none !p-0 bg-transparent"
                >
                  <TableCell className="border text-center">
                    {malha.malha}
                  </TableCell>
                  <TableCell className="border text-center">
                    {fornecedoresPedidos(dadosFornecedoresPedidos)}
                  </TableCell>
                  <TableCell className="border text-center">
                    {malha.unidade === "Un" ? (
                      <InputQuantidadeSeUnidade
                        idBm={idBm}
                        ref={malha.ref}
                        qtdeEntradaSeUnidade={malha.qtdeEntradaSeUnidade ?? 0}
                      />
                    ) : (
                      malha.qtdePedida.toString()
                    )}
                  </TableCell>
                  <TableCell className="border text-center">
                    {malha.qtdeEntrada.toString()}
                  </TableCell>
                  <TableCell className="border text-center">
                    <InputLotes idBm={idBm} ref={malha.ref} lote={malha.lote} />
                  </TableCell>
                  <TableCell className="border text-center">
                    {malha.sobras.toString()}
                  </TableCell>
                  <TableCell className="border text-center">
                    <InputDefeitos
                      idBm={idBm}
                      ref={malha.ref}
                      defeitosStock={malha.defeitosStock}
                    />
                  </TableCell>
                  <TableCell className="border text-center">
                    {formatNCasasDecimais(qtdeTotalLinha, 3)}
                  </TableCell>
                  {mostraBotaoApagaMalhaEmenosDeOitoPercentagem && (
                    <TableCell className="border text-center">
                      <BotaoApagaMalha idBm={idBm} ref={malha.ref} op={op} />
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell className="border text-left" colSpan={7}>
                Total
              </TableCell>
              <TableCell className="border text-center">
                {formatNCasasDecimais(total, 4)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
};
export default Malha;
