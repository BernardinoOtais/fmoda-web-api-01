"use client";

import { ConteudoDto } from "@repo/tipos/embarques_idenvio";
import React, { Fragment } from "react";

import ApagaConteudo from "./apaga-conteudo";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type ConteudoClienteProps = {
  conteudos: ConteudoDto[] | undefined;
  conteudosAgrupados: Record<
    number,
    {
      idItem: number;
      totalQtt: number;
      totalPeso: number;
      count: number;
    }
  >;
  itensSelecionados: number[];
  setItensSelecionados: React.Dispatch<React.SetStateAction<number[]>>;
  disabledApaga: boolean;
};
const ConteudoCliente = ({
  conteudos,
  conteudosAgrupados,
  itensSelecionados,
  setItensSelecionados,
  disabledApaga,
}: ConteudoClienteProps) => {
  //"bg-destructive text-destructive-foreground"

  return conteudos?.map((c, index, array) => {
    const isLastForIdItem =
      index === array.length - 1 || array[index + 1]?.idItem !== c.idItem;

    const groupSummary = conteudosAgrupados[c.idItem];
    return (
      <Fragment key={c.idConteudo}>
        <TableRow
          className={cn({
            "bg-destructive text-destructive-foreground hover:bg-destructive/30":
              itensSelecionados.includes(c.idConteudo),
          })}
        >
          <TableCell className="rounded-l-md">{c.op}</TableCell>
          <TableCell>{c.Op.modelo}</TableCell>
          <TableCell>{c.Op.cor}</TableCell>
          <TableCell>{c.Op.pedido}</TableCell>
          <TableCell>
            <ApagaConteudo
              nome={c.Item.Descricao}
              idConteudo={c.idConteudo}
              setItensSelecionados={setItensSelecionados}
              estaSelecionado={itensSelecionados.includes(c.idConteudo)}
              disabledApaga={disabledApaga}
            />
          </TableCell>
          <TableCell className="text-center">
            {c.tam === "nt" ? "" : c.tam}
          </TableCell>
          <TableCell className="text-center">{c.qtt}</TableCell>
          <TableCell>{c.Unidades.descricaoUnidade}</TableCell>
          <TableCell className="text-center">
            {c.qtt == 0 ? 0 : (c.peso / c.qtt).toFixed(5)}
          </TableCell>
          <TableCell className="rounded-r-md text-center">
            {c.peso.toFixed(5)}
          </TableCell>
        </TableRow>
        {isLastForIdItem && groupSummary && groupSummary.count > 1 && (
          <TableRow>
            <TableCell colSpan={4}></TableCell>
            <TableCell colSpan={1} className="font-bold">
              {c.Item.Descricao}
            </TableCell>
            <TableCell className="text-center font-bold">-</TableCell>
            <TableCell className="text-center font-bold">
              {Number.isInteger(groupSummary.totalQtt)
                ? groupSummary.totalQtt
                : Number(groupSummary.totalQtt).toFixed(3)}
            </TableCell>
            <TableCell className="font-bold">-</TableCell>
            <TableCell className="text-center font-bold">-</TableCell>
            <TableCell className="text-center font-bold">
              {groupSummary.totalPeso.toFixed(5)}
            </TableCell>
          </TableRow>
        )}
      </Fragment>
    );
  });
};

export default ConteudoCliente;
