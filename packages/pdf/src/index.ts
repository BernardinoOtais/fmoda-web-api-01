import {
  PdfText,
  Pdf2JsonText,
  ErroImportarPedido,
  NPEDIDO,
  TOTAL_PEDIDO,
  PRECIO_COSTE,
  PAGINA,
  UNID_LOTE,
  PEDIDO,
  ENTREGAS_PARCIALES,
  ResultadoPedido,
} from "@repo/tipos/pdf";

import {
  parsePdf2Json,
  transformaTextoEmNumero,
  extraiTodasEntregasPaciais,
  extraiPorcoesNaoInclusive,
  extraiPorcoesInclusive,
  groupItemsByYCoordinate,
  getValuesBeneathOptimized,
  trataPedidoPrincipal,
  tratoPedidosParciais,
} from "./aux";

export const transformaPedidoEmJson = async (buffer: Buffer<ArrayBuffer>) => {
  const pdfRaw: Pdf2JsonText[] = await parsePdf2Json(buffer);

  const decoded: PdfText[] = pdfRaw.map((t) => ({
    x: t.x,
    y: t.y,
    text: decodeURIComponent(t.R.map((r) => r.T ?? "").join(" ")),
  }));

  const cabecalhoPedido = extraiPorcoesInclusive(
    decoded,
    NPEDIDO,
    TOTAL_PEDIDO
  );

  if (cabecalhoPedido.length === 0)
    return ErroImportarPedido.ERRO_NO_CABECALHO_LISTA_VAZIA;

  const cabecalhoDados = getValuesBeneathOptimized(cabecalhoPedido);

  const pedidoPrincipal = extraiPorcoesNaoInclusive(
    decoded,
    TOTAL_PEDIDO,
    UNID_LOTE
  );

  const pedidoPrincipalAgrupado = groupItemsByYCoordinate(pedidoPrincipal);

  const encomenda = trataPedidoPrincipal(pedidoPrincipalAgrupado);
  if (typeof encomenda === "string") return encomenda;

  if (cabecalhoDados.dataEntrega !== null) {
    const preco = extraiPorcoesInclusive(decoded, PRECIO_COSTE, PAGINA, true);

    const precoPeca = preco[1]?.text;

    if (!precoPeca)
      return ErroImportarPedido.ERRO_TEM_QUE_TER_PRECO_ENTREGA_UNICA;

    const valorPrecoPeca = precoPeca.replace(" EUR", "");

    const precoFinal = transformaTextoEmNumero(valorPrecoPeca, "float");

    if (precoFinal === null)
      return ErroImportarPedido.ERRO_TEM_QUE_TER_PRECO_ENTREGA_UNICA_E_TRANSFORMAVEL;

    return {
      detalhesPeca: {
        preco: precoFinal,
        nPedido: cabecalhoDados.Pedido,
        modelo: cabecalhoDados.Modelo,
        descModelo: cabecalhoDados.DescModelo,
        temporada: cabecalhoDados.Temporada,
        dataEntrega: cabecalhoDados.dataEntrega,
        pedido: encomenda,
      },
    };
  }

  const entregasParciais = extraiTodasEntregasPaciais(
    decoded,
    PEDIDO,
    PRECIO_COSTE,
    ENTREGAS_PARCIALES
  );

  const tamanhoPedidosParciais = entregasParciais.length;

  if (tamanhoPedidosParciais < 2)
    return ErroImportarPedido.PEDIDO_PARCIAL_TEM_QUE_TER_MAIS_QUE_UMA_ENTREGA;

  const results: {
    pedido: string;
    nParcial: number;
    dataParcial: Date;
    precoParcial: number;
    parcial: ResultadoPedido;
  }[] = [];
  let foundString: ErroImportarPedido | null = null;

  for (const e of entregasParciais) {
    const result = tratoPedidosParciais(groupItemsByYCoordinate(e));

    if (typeof result === "string") {
      foundString = result;
      break;
    }

    results.push(result);
  }

  if (foundString) return foundString;

  if (results.length === 0)
    return ErroImportarPedido.ERRO_NO_PARCIAL_TEM_QUE_EXISTIR_PELO_MENOS_UMA_ENTREGA;

  return {
    detalhesPeca: {
      nPedido: cabecalhoDados.Pedido,
      modelo: cabecalhoDados.Modelo,
      descModelo: cabecalhoDados.DescModelo,
      temporada: cabecalhoDados.Temporada,
      dataEntrega: cabecalhoDados.dataEntrega,
      pedido: encomenda,
      parciais: results,
    },
  };
};
