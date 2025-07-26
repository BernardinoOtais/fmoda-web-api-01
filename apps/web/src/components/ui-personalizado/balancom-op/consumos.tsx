"use client";

import {
  BmDadosParaConsumo,
  BmFaturado,
  BmTotais,
} from "@repo/tipos/qualidade_balancom";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNCasasDecimais } from "@/lib/my-utils";

type ConsumosProps = {
  consumos: BmDadosParaConsumo;
  faturado: BmFaturado;
  totais: BmTotais;
};

const Consumos = ({ consumos, faturado, totais }: ConsumosProps) => {
  return (
    <>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mx-auto">
        Consumos
      </h3>
      {consumos.map((con) => {
        return (
          <div key={con.malha}>
            <h4 className="scroll-m-20 text-xs font-semibold tracking-tight text-center mb-2">
              {con.malha}
            </h4>

            <Table className="max-w-4xl mx-auto">
              <TableHeader className="bg-accent">
                <TableRow className="!border-0 border-none">
                  {faturado.map((fa) => {
                    return (
                      <TableHead
                        key={fa.nFatutura}
                        className="border text-center"
                      >
                        {`F.${fa.nFatutura}`}
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                <TableRow>
                  {faturado.map((faa) => {
                    return (
                      <TableCell
                        key={faa.nFatutura}
                        className="border text-center"
                      >
                        {totais.totalQtt === 0
                          ? ""
                          : formatNCasasDecimais(
                              (con.qttUsada * faa.qtt) / totais.totalQtt,
                              3
                            )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        );
      })}
    </>
  );
};

export default Consumos;
