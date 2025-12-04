import { FaturasPlaneadasDto } from "@repo/tipos/joana/faturasplan";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoneyPT } from "@/lib/my-utils";

type FaturacaoPlaneadaWebProps = {
  dadosPlaneados: FaturasPlaneadasDto;
};

const FaturacaoPlaneadaWeb = ({
  dadosPlaneados,
}: FaturacaoPlaneadaWebProps) => {
  const { dados } = dadosPlaneados;
  return (
    <>
      <Table className="w-full border border-border rounded-md border-collapse ">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="text-center font-semibold border border-border h-7">
              Semana
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Data
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Pedido
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Op
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Cliente
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Modelo
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Fornecedor
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Valor Seriço
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Valor Total
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Qtt Prevista
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Valor Op
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Valor Total
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {dados.map((s, sIdx) => {
            let semanaRowAdded = false;
            const rows: React.JSX.Element[] = [];
            s.dataSemanda.map((d, dIdx) => {
              let dataRowAdded = false;

              d.detalhe.map((de, deIdx) => {
                rows.push(
                  <TableRow key={`${sIdx}-${dIdx}-${deIdx}-`}>
                    {!semanaRowAdded && (
                      <TableCell
                        className="border border-border text-center  h-2 px-1 py-0"
                        rowSpan={s.spanSemana}
                      >
                        {s.SemanaNumero}
                      </TableCell>
                    )}

                    {!dataRowAdded && (
                      <TableCell
                        rowSpan={d.spanData}
                        className="border border-border text-center  h-2 px-1 py-0"
                      >
                        {d.data.toLocaleDateString("pt-PT")}
                      </TableCell>
                    )}

                    <>
                      <TableCell className="border border-border text-center h-2 px-1 py-0">
                        {de.pedido}
                      </TableCell>
                      <TableCell className="border border-border text-center h-2 px-1 py-0">
                        {de.obrano}
                      </TableCell>
                      <TableCell className="border border-border text-center h-2 px-1 py-0">
                        {de.cliente}
                      </TableCell>
                      <TableCell className="border border-border text-center h-2 px-1 py-0">
                        {de.design}
                      </TableCell>
                      <TableCell className="border border-border text-center h-2 px-1 py-0">
                        <div className="flex flex-col">
                          {de.fornecedores.map((f) => (
                            <span key={f.nome}>{f.nome}</span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="border border-border text-center h-2 px-1 py-0">
                        <div className="flex flex-col">
                          {de.fornecedores.map((f) => (
                            <span key={f.nome}>
                              {formatMoneyPT(f.valorServico)}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="border border-border text-center h-2 px-1 py-0">
                        <div className="flex flex-col">
                          {de.fornecedores.map((f) => (
                            <span key={f.nome}>
                              {formatMoneyPT(f.valorServico * de.qtt)}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="border border-border text-center h-2 px-1 py-0">
                        {de.qtt}
                      </TableCell>
                      <TableCell className="border border-border text-center h-2 px-1 py-0">
                        {formatMoneyPT(de.u_total)}
                      </TableCell>
                      <TableCell className="border border-border text-center h-2 px-1 py-0">
                        {formatMoneyPT(de.valorTotail)}
                      </TableCell>
                    </>
                  </TableRow>
                );
                semanaRowAdded = true;
                dataRowAdded = true;
              });
            });

            return rows;
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default FaturacaoPlaneadaWeb;
