import {
  ErroImportarPedidoHm,
  PdfText,
  Campos,
  TipoCamposDinamicos,
  campoArticleHm,
  campoTotaisAssortments,
  campoTotalTotal,
} from "@repo/tipos/pdf";

import {
  extraiPorcoesInclusive,
  extraiPorcoesNaoInclusive,
  extraiPorcoesNaoInclusiveProcuraSegundoApartirDoPrimeiro,
  groupItemsByYCoordinate,
} from "./aux";

type SizeQuantity = {
  tam: string;
  qtt: number;
};

type Returno = {
  destino: {
    dCod: string;
    destino: string;
  };
  arttigo: object;
  assortment: {
    assort: SizeQuantity[];
    totalAs: object;
  };
  single: {
    dist: SizeQuantity[];
    totalsSingle: object;
  };
  total: {
    dist: SizeQuantity[];
    total: object;
  };
}[];

export const seTodasIguaisRetornaAPrimeira = (
  listas: PdfText[][],
): PdfText[] | null => {
  if (listas.length === 0 || listas[0] === undefined) return null;

  const base = JSON.stringify(listas[0]);

  for (let i = 1; i < listas.length; i++) {
    if (JSON.stringify(listas[i]) !== base) {
      return null;
    }
  }

  return listas[0];
};

export const dadosCorpoHm = (dadosPaises: PdfText[][]) => {
  const retorno: Returno = [];
  // console.log(dadosPaises.length);
  for (const p of dadosPaises) {
    const pais = extraiPorcoesNaoInclusive(
      p,
      "Size / Colour breakdown".toUpperCase(),
      "Article No:".toUpperCase(),
    );
    const paisTexto = linhaParaTexto(pais);

    const dadosArticle = extraiPorcoesInclusive(
      p,
      "Article No:".toUpperCase(),
      "Assortment".toUpperCase(),
    );

    const linhasDadosArticle = groupItemsByYCoordinate(dadosArticle);

    const dadosArticleObrject = dadosDoCabecalhoHm(
      linhasDadosArticle,
      7,
      campoArticleHm,
      false,
    );

    //console.log(dadosArticleObrject);

    const paisParaPost = parseDestinoECodigo(paisTexto);

    const assortmentDados = extraiPorcoesNaoInclusive(
      p,
      "Assortment".toUpperCase(),
      "Quantity:".toUpperCase(),
    );
    const assortment = extractSizesAndQuantities(assortmentDados);

    //console.log("assortment :", assortment);

    const totaisAssortment = extraiPorcoesInclusive(
      p,
      "Quantity:".toUpperCase(),
      "Solid".toUpperCase(),
    );

    const linhasDadosAss = groupItemsByYCoordinate(totaisAssortment);

    const size = Object.entries(linhasDadosAss).length;
    const totalAs = dadosDoCabecalhoHm(
      linhasDadosAss,
      size,
      campoTotaisAssortments,
      false,
    );

    const singleDados =
      extraiPorcoesNaoInclusiveProcuraSegundoApartirDoPrimeiro(
        p,
        "Solid".toUpperCase(),
        "Quantity:".toUpperCase(),
      );

    const singles = extractSizesAndQuantities(singleDados);

    //console.log("singles :", singles);

    const totalSingle =
      extraiPorcoesNaoInclusiveProcuraSegundoApartirDoPrimeiro(
        p,
        "Solid".toUpperCase(),
        "otal".toUpperCase(),
      );

    const tamanho = totalSingle.length;
    const qttSingles = safeNumber(totalSingle[tamanho - 2]?.text);

    const totalDados = extraiPorcoesNaoInclusiveProcuraSegundoApartirDoPrimeiro(
      p,
      "otal".toUpperCase(),
      "Quantity:".toUpperCase(),
    );
    const total = extractSizesAndQuantities(totalDados);

    const totalTotal = extraiPorcoesNaoInclusiveProcuraSegundoApartirDoPrimeiro(
      p,
      "otal".toUpperCase(),
      "* Sizes in brackets indicate Standard, first row in Size Label (Corresponding Sizes)".toUpperCase(),
    );

    const linhasTotalTotal = groupItemsByYCoordinate(totalTotal);

    const sizeTotalTotal = Object.entries(linhasTotalTotal).length;

    const totalTotalToatl = dadosDoCabecalhoHm(
      linhasTotalTotal,
      sizeTotalTotal,
      campoTotalTotal,
      false,
    );

    retorno.push({
      destino: paisParaPost,
      arttigo: dadosArticleObrject,
      assortment: { assort: assortment, totalAs: totalAs },
      single: {
        dist: singles,
        totalsSingle: {
          total: qttSingles,
        },
      },
      total: {
        dist: total,
        total: totalTotalToatl,
      },
    });
  }
  return retorno;
};

export const dadosDoCabecalhoHm = (
  dados: Record<number, PdfText[]>,
  nlinhas: number,
  campos: Campos[],
  tiraLinhaInicialEFinal = true,
) => {
  const keys = Object.keys(dados);
  const qttLinhas = keys.length;

  if (!(qttLinhas === nlinhas))
    return ErroImportarPedidoHm.ERRO_HH_CABECALHO_TEM_QUE_TER_NOVE_LINHAS;

  keys.sort((a, b) => Number(a) - Number(b));

  const chavesSemAPrimeiraEAUltima = tiraLinhaInicialEFinal
    ? keys.slice(1, -1)
    : keys;

  const cabecalho = {};

  chavesSemAPrimeiraEAUltima.forEach((c) => {
    const valor = dados[Number(c)];
    if (!valor) return;

    const linha = linhaParaTexto(valor);
    //console.log(linha);
    const parsed = parseDadosPedido(linha, campos);

    // Merge parsed data into single object
    Object.assign(cabecalho, parsed);
  });

  return cabecalho;
};

const parseDestinoECodigo = (
  text: string,
): { dCod: string; destino: string } => {
  const match = text.match(/^(.+?)\s+\(([^)]+)\)\s*$/);

  return {
    destino: match?.[1]?.trim() || "",
    dCod: match?.[2]?.trim() || "",
  };
};

const parseDadosPedido = (
  text: string,
  campos: Campos[],
): TipoCamposDinamicos => {
  const mappings = campos;
  const result: TipoCamposDinamicos = {};

  for (let i = 0; i < mappings.length; i++) {
    const current = mappings[i];
    const nextMapping = mappings[i + 1];

    if (!current) continue;

    const startIndex = text.indexOf(current.nome);

    if (startIndex !== -1) {
      const valueStart = startIndex + current.nome.length;

      let valueEnd = text.length;
      if (nextMapping) {
        const nextIndex = text.indexOf(nextMapping.nome, valueStart);
        if (nextIndex !== -1) {
          valueEnd = nextIndex;
        }
      }

      const value = text.substring(valueStart, valueEnd).trim();
      if (value) {
        result[current.key] = value;
      }
    }
  }

  return result;
};

export const linhaParaTexto = (lista: PdfText[]): string => {
  return lista
    .slice()
    .sort((a, b) => a.x - b.x)
    .map((t) => t.text)
    .join("") // raw join
    .replace(/\s+/g, " ") // normalize spaces
    .trim();
};

function extractSizesAndQuantities(items: PdfText[]): SizeQuantity[] {
  const tolerance = 0.1;
  const lines = new Map<number, PdfText[]>();

  // Group by y coordinate
  items.forEach((item) => {
    const existingY = Array.from(lines.keys()).find(
      (y) => Math.abs(y - item.y) < tolerance,
    );
    const lineY = existingY ?? item.y;
    if (!lines.has(lineY)) lines.set(lineY, []);
    lines.get(lineY)!.push(item);
  });
  //console.log("items ;", items);

  /*
[
  { x: 1.8130000000000002, y: 31.397, text: '92 (92)*' },
  { x: 9.801, y: 31.397, text: '672' },
  { x: 1.8130000000000002, y: 32.141, text: '98/104 (98/104)*' },
  { x: 9.436, y: 32.141, text: '1 608' },
  { x: 1.8130000000000002, y: 32.884, text: '1' },
  { x: 2.023, y: 32.884, text: '10/1' },
  { x: 2.842, y: 32.884, text: '16 (1' },
  { x: 3.8070000000000004, y: 32.884, text: '10/1' },
  { x: 4.626, y: 32.884, text: '16)*' },
  { x: 9.436, y: 32.884, text: '1 741' },
  { x: 1.8130000000000002, y: 33.628, text: '122/128 (122/128)*' },
  { x: 9.436, y: 33.628, text: '1 805' },
  { x: 1.8130000000000002, y: 34.372, text: '134/140 (134/140)*' },
  
  */

  // Process each line
  return Array.from(lines.values())
    .map((lineItems) => {
      const sorted = lineItems.sort((a, b) => a.x - b.x);

      if (sorted.length < 2) return null; // Need at least 2 items

      // Find largest x-gap
      let maxGap = 0,
        splitIndex = 0;
      for (let i = 0; i < sorted.length - 1; i++) {
        const current = sorted[i];
        const next = sorted[i + 1];
        if (!current || !next) continue;

        const gap = next.x - current.x;
        if (gap > maxGap) {
          maxGap = gap;
          splitIndex = i;
        }
      }

      if (maxGap < 3) return null; // Skip if no significant gap

      const tam = sorted
        .slice(0, splitIndex + 1)
        .map((i) => i.text)
        .join("")
        .trim();
      const qtt = parseInt(
        sorted
          .slice(splitIndex + 1)
          .map((i) => i.text)
          .join("")
          .replace(/\s+/g, "") // Remove all spaces
          .trim(),
        10,
      );

      return tam && !isNaN(qtt) ? { tam, qtt } : null;
    })
    .filter((item): item is SizeQuantity => item !== null);
}

const safeNumber = (v?: string) => {
  if (!v) return 0;
  return Number(v.replace(/[\s,]+/g, ""));
};
