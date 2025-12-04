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
  const { dados, valorTotalAPagar, valorTotalAReceber, qttTotal } =
    dadosPlaneados;
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
                let fornecedoresRowAdded = false;
                const detalheSpan = de.fornecedores.length;
                de.fornecedores.map((f, fIdx) => {
                  rows.push(
                    <TableRow key={`${sIdx}-${dIdx}-${deIdx}-${fIdx}`}>
                      {!semanaRowAdded && (
                        <TableCell
                          className="border border-border text-center  h-2 px-1 py-0"
                          rowSpan={
                            s.spanSemana > 1 ? s.spanSemana + 1 : s.spanSemana
                          }
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

                      {!fornecedoresRowAdded && (
                        <>
                          <TableCell
                            rowSpan={detalheSpan}
                            className="border border-border text-center h-2 px-1 py-0"
                          >
                            {de.pedido}
                          </TableCell>
                          <TableCell
                            rowSpan={detalheSpan}
                            className="border border-border text-center h-2 px-1 py-0"
                          >
                            {de.obrano}
                          </TableCell>
                          <TableCell
                            rowSpan={detalheSpan}
                            className="border border-border text-center h-2 px-1 py-0"
                          >
                            {de.cliente}
                          </TableCell>
                          <TableCell
                            rowSpan={detalheSpan}
                            className="border border-border text-center h-2 px-1 py-0"
                          >
                            {de.design}
                          </TableCell>
                        </>
                      )}

                      <TableCell className="border border-border text-center h-2 px-1 py-0">
                        {f.nome}
                      </TableCell>
                      <TableCell className="border border-border text-center h-2 px-1 py-0">
                        {formatMoneyPT(f.valorServico)}
                      </TableCell>

                      {!fornecedoresRowAdded && (
                        <>
                          <TableCell
                            rowSpan={detalheSpan}
                            className="border border-border text-center h-2 px-1 py-0"
                          >
                            {formatMoneyPT(
                              de.fornecedores.reduce(
                                (acc, f) => acc + f.valorServico * de.qtt,
                                0
                              )
                            )}
                          </TableCell>
                          <TableCell
                            rowSpan={detalheSpan}
                            className="border border-border text-center h-2 px-1 py-0"
                          >
                            {de.qtt}
                          </TableCell>
                          <TableCell
                            rowSpan={detalheSpan}
                            className="border border-border text-center h-2 px-1 py-0"
                          >
                            {formatMoneyPT(de.u_total)}
                          </TableCell>
                          <TableCell
                            rowSpan={detalheSpan}
                            className="border border-border text-center h-2 px-1 py-0"
                          >
                            {formatMoneyPT(de.u_total * de.qtt)}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  );

                  fornecedoresRowAdded = true;
                  semanaRowAdded = true;
                  dataRowAdded = true;
                });
              });
            });

            // EXTRA ROW BELOW THE WEEK IF spanSemana > 1
            if (s.spanSemana > 1) {
              rows.push(
                <TableRow key={`extra-row-${sIdx}`}>
                  <TableCell colSpan={7} />
                  <TableCell className="border border-border text-center h-2 px-1 py-0">
                    {formatMoneyPT(s.valorServicoT)}
                  </TableCell>
                  <TableCell className="border border-border text-center h-2 px-1 py-0">
                    {s.qtt}
                  </TableCell>
                  <TableCell />
                  <TableCell className="border border-border text-center h-2 px-1 py-0">
                    {formatMoneyPT(s.valorTotalFatura)}
                  </TableCell>
                </TableRow>
              );
            }

            return rows;
          })}
          <TableRow className="border border-border text-center  h-2 px-1 py-0">
            <TableCell colSpan={7} />
            <TableCell className="border border-border text-center h-2 px-1 py-0">
              Total
            </TableCell>
            <TableCell className="border border-border text-center h-2 px-1 py-0">
              {formatMoneyPT(valorTotalAPagar)}
            </TableCell>
            <TableCell className="border border-border text-center h-2 px-1 py-0">
              {qttTotal}
            </TableCell>
            <TableCell colSpan={1} />
            <TableCell className="border border-border text-center h-2 px-1 py-0">
              {formatMoneyPT(valorTotalAReceber)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default FaturacaoPlaneadaWeb;
