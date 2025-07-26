"use client";

import { BmOpDto } from "@repo/tipos/qualidade_balancom";
import { useSuspenseQuery } from "@repo/trpc";
import React, { Fragment } from "react";

import BoTaoRetiraOp from "./inputs-e-botoes-de-faturado/botao-retira-op";
import InputCmrObs from "./inputs-e-botoes-de-faturado/input-cmr-obs";
import ImputPesosLiquidoEBruto from "./inputs-e-botoes-de-faturado/input-pesos-liquido-e-bruto";
import FotoClient from "../fotos/foto-client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/trpc/client";

type FaturadoProps = { idBm: string };

const Faturado = ({ idBm }: FaturadoProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.qualidade_balancom_op.getBmDataViaId.queryOptions(idBm)
  );

  const bmOp: BmOpDto = data?.BmOp;

  const groupedByFoto = new Map<string, typeof bmOp>();

  bmOp?.forEach((item) => {
    if (!groupedByFoto.has(item.foto)) {
      groupedByFoto.set(item.foto, []);
    }
    groupedByFoto.get(item.foto)?.push(item);
  });

  const nOps = bmOp?.length;

  return (
    <>
      {Array.from(groupedByFoto.entries()).map(([foto, opsForFoto]) => (
        <Fragment key={foto}>
          <FotoClient
            src={foto}
            alt="Foto Modelo"
            cssImage="w-24 mx-auto m-2 self-center "
          />
          {opsForFoto?.map((op, index) => (
            <Fragment key={op.op}>
              <div className="flex flex-row mx-auto gap-x-2">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mx-auto ">
                  {`Faturado ${op.op}`}
                </h3>
                {(index > 0 || nOps === 1) && (
                  <BoTaoRetiraOp idBm={idBm} op={op.op} />
                )}
              </div>
              <div>
                <Table className="max-w-4xl mx-auto">
                  <TableHeader className="bg-accent">
                    <TableRow className="!border-0 border-none">
                      <TableHead className="border text-center">
                        Pedido
                      </TableHead>
                      <TableHead className="border text-center">Ref</TableHead>
                      <TableHead className="border text-center">
                        Fatura
                      </TableHead>
                      <TableHead className="border text-center">Data</TableHead>
                      <TableHead className="border text-center">
                        Qtde Faturada
                      </TableHead>
                      <TableHead className="border text-center">
                        Peso Bruto
                      </TableHead>
                      <TableHead className="border text-center">
                        Peso Liquido
                      </TableHead>
                      <TableHead className="border text-center">CMR</TableHead>
                      <TableHead className="border text-center">OBS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {op.BmOpFaturado?.map((faturado) => {
                      return (
                        <TableRow key={faturado.nFatutura}>
                          <TableCell className="border text-center">
                            {faturado.pedido}
                          </TableCell>
                          <TableCell className="border text-center">
                            {faturado.refModelo}
                          </TableCell>
                          <TableCell className="border text-center">
                            {faturado.nFatutura.toString()}
                          </TableCell>
                          <TableCell className="border text-center">
                            {faturado.dataFatura}
                          </TableCell>
                          <TableCell className="border text-center">
                            {faturado.qtt}
                          </TableCell>
                          <TableCell className="border">
                            <ImputPesosLiquidoEBruto
                              idBm={idBm}
                              op={faturado.op}
                              nFatutura={faturado.nFatutura}
                              chave="pesoBruto"
                              pesoOriginal={faturado.pesoBruto}
                            />
                          </TableCell>
                          <TableCell className="border ">
                            <ImputPesosLiquidoEBruto
                              idBm={idBm}
                              op={faturado.op}
                              nFatutura={faturado.nFatutura}
                              chave="pesoLiquido"
                              pesoOriginal={faturado.pesoLiquido}
                            />
                          </TableCell>
                          <TableCell className="border ">
                            <InputCmrObs
                              idBm={idBm}
                              op={faturado.op}
                              nFatutura={faturado.nFatutura}
                              chave="cmr"
                              valorOriginal={faturado.cmr}
                            />
                          </TableCell>
                          <TableCell className="border ">
                            <InputCmrObs
                              idBm={idBm}
                              op={faturado.op}
                              nFatutura={faturado.nFatutura}
                              chave="obs"
                              valorOriginal={faturado.obs ?? ""}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </>
  );
};
export default Faturado;
