//import util from "util";

import {
  campoCabecalhoHm,
  ErroImportarPedidoHm,
  Pdf2JsonText,
  PdfText,
} from "@repo/tipos/pdf";

import {
  extraiPorcoessEntreDuasStrings,
  groupItemsByYCoordinate,
  parsePdf2Json,
  safeDecode,
  seTodasIguaisRetornaAPrimeira,
} from "@/aux/aux";
import { dadosCorpoHm, dadosDoCabecalhoHm } from "@/aux/aux-hm";

export const tranformaPedidoHmEmJson = async (buffer: Buffer<ArrayBuffer>) => {
  const pdfRaw: Pdf2JsonText[] = await parsePdf2Json(buffer);

  const decoded: PdfText[] = pdfRaw.map((t) => ({
    x: t.x,
    y: t.y,
    text: safeDecode(t.R.map((r) => r.T ?? "").join(" ")),
  }));

  const cabecalhoPagina = extraiPorcoessEntreDuasStrings(
    decoded,
    "H&M",
    "Size / Colour breakdown",
  );

  const cabecalho = seTodasIguaisRetornaAPrimeira(cabecalhoPagina);

  if (!cabecalho) return ErroImportarPedidoHm.ERRO_HM_CABECALHOS_DIFERENTES;

  const linhasCabecalho = groupItemsByYCoordinate(cabecalho);

  const dadosC = dadosDoCabecalhoHm(linhasCabecalho, 9, campoCabecalhoHm);

  if (dadosC === ErroImportarPedidoHm.ERRO_HH_CABECALHO_TEM_QUE_TER_NOVE_LINHAS)
    return ErroImportarPedidoHm.ERRO_HH_CABECALHO_TEM_QUE_TER_NOVE_LINHAS;

  const corposPagina = extraiPorcoessEntreDuasStrings(
    decoded,
    "Size / Colour breakdown",
    "* Sizes in brackets indicate Standard, first row in Size Label (Corresponding Sizes)",
  );

  const dadosDestino = dadosCorpoHm(corposPagina);

  const resultado = {
    linhasCabecalho: dadosC,
    dadosDestino,
  };

  /*  console.log(
    util.inspect(resultado, {
      depth: null,
      colors: true,
      maxArrayLength: null,
    }),
  );*/
  return resultado;
};
