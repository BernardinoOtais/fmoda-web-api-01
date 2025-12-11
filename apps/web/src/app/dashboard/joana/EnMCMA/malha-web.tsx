import { MalhasEntradasMcMaDto } from "@repo/tipos/joana/emmcma";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";

type MalhaWebProps = {
  dados: MalhasEntradasMcMaDto[];
};

const MalhaWeb = ({ dados }: MalhaWebProps) => {
  return (
    <>
      <Table className=" border border-border rounded-md border-collapse">
        <TableHeader className="bg-muted ">
          <TableRow>
            <TableHead className="text-center font-semibold border border-border h-7">
              Op
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Tipo
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Malha
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Pedido
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Recebido
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7 ">
              Enviado
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Unid
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dados.map((op, opIdx) => {
            let opRowAdded = false;
            const rows: React.JSX.Element[] = [];
            op.detalheMalha.map((de, deIdx) => {
              let deRowAdded = false;
              de.malhas.map((m, mIdx) => {
                rows.push(
                  <TableRow key={`${opIdx}-${deIdx}-${mIdx}`}>
                    {!opRowAdded && (
                      <TableCell
                        className="border border-border text-center  px-1 py-0 "
                        rowSpan={op.spanOp}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <span>
                            Op: <span className="font-bold">{op.obrano}</span>
                          </span>
                          <span>
                            Cliente:
                            <span className="font-bold">{op.cliente}</span>
                          </span>
                          <span className="text-center ">{op.design}</span>
                          <span className="text-center">
                            Cor: <span className="font-bold">{op.cor}</span>
                          </span>
                          {process.env.NODE_ENV === "production" && (
                            <LazyFotoClient
                              src={op.foto || ""}
                              alt="Foto Modelo"
                              cssImage="w-40 h-40 object-contain rounded-md border border-border"
                            />
                          )}
                        </div>
                      </TableCell>
                    )}
                    {!deRowAdded && (
                      <TableCell
                        rowSpan={de.detalheMalhaSpan}
                        className="border border-border  h-2 px-1 py-0 text-center w-0"
                      >
                        {de.perfix.toUpperCase()}
                      </TableCell>
                    )}

                    <TableCell className="border border-border  h-2 px-1 py-0">
                      {m.design}
                    </TableCell>
                    <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                      {m.qtt}
                    </TableCell>
                    <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                      {m.recebido}
                    </TableCell>
                    <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                      {m.enviado}
                    </TableCell>
                    <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                      {m.unidade}
                    </TableCell>
                  </TableRow>
                );
                opRowAdded = true;
                deRowAdded = true;
              });
            });
            return rows;
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default MalhaWeb;
