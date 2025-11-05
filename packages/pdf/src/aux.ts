import {
  CorQtts,
  ErroImportarPedido,
  keywordToKey,
  LISTAVALORES,
  Pdf2JsonData,
  Pdf2JsonText,
  PdfText,
  PedidoResult,
  QttPorCor,
  ResultadoPedido,
  Tamanhos,
} from "@repo/tipos/pdf";

export async function parsePdf2Json(buffer: Buffer): Promise<Pdf2JsonText[]> {
  const { default: PDFParser } = await import("pdf2json");
  const pdfParser: InstanceType<typeof PDFParser> = new PDFParser();

  const pdfData: Pdf2JsonData = await new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData: unknown) => {
      if (
        typeof errData === "object" &&
        errData !== null &&
        "parserError" in errData
      ) {
        reject((errData as { parserError: Error }).parserError);
      } else {
        reject(new Error("Unknown PDF parsing error"));
      }
    });

    pdfParser.on("pdfParser_dataReady", (data: unknown) => {
      if (
        typeof data === "object" &&
        data !== null &&
        "Pages" in data &&
        Array.isArray((data as Pdf2JsonData).Pages)
      ) {
        resolve(data as Pdf2JsonData);
      } else {
        reject(new Error("Invalid PDF data structure"));
      }
    });

    pdfParser.parseBuffer(buffer);
  });

  const resultado = pdfData.Pages.flatMap((page) => page.Texts ?? []);

  return resultado;
}

export const extraiTodasEntregasPaciais = (
  data: PdfText[],
  textoInicial: string,
  textoFinal: string,
  inicio: string
): PdfText[][] => {
  const sections: PdfText[][] = [];

  let currentStart = data.findIndex((t) =>
    t.text.toUpperCase().includes(inicio)
  );
  if (currentStart === -1) return [];

  currentStart = data.findIndex(
    (t, i) => i > currentStart && t.text.toUpperCase().includes(textoInicial)
  );

  while (currentStart !== -1) {
    const endIndex = data.findIndex(
      (t, i) => i > currentStart && t.text.toUpperCase().includes(textoFinal)
    );
    if (endIndex === -1) break;

    const nextElement = data[endIndex + 1];
    const sliceEnd = nextElement ? endIndex + 1 : endIndex;

    const section = data.slice(currentStart, sliceEnd + 1);
    sections.push(section);

    currentStart = data.findIndex(
      (t, i) => i > endIndex && t.text.toUpperCase().includes(textoInicial)
    );
  }

  return sections;
};

export const extraiPorcoesNaoInclusive = (
  data: PdfText[],
  textoInicial: string,
  textoFinal: string
): PdfText[] => {
  const startIndex = data.findIndex((t) =>
    t.text.toUpperCase().includes(textoInicial)
  );
  const endIndex = data.findIndex((t) =>
    t.text.toUpperCase().includes(textoFinal)
  );

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex + 1) {
    return [];
  }
  return data.slice(startIndex + 1, endIndex);
};

export const extraiPorcoesInclusive = (
  data: PdfText[],
  textoInicial: string,
  textoFinal: string,
  contem: boolean = false
): PdfText[] => {
  const normalize = (s: string) => s.trim().toUpperCase();
  const contains = (a: string, b: string) => a.includes(b);
  const textoFinalUpper = normalize(textoFinal);
  const startIndex = data.findIndex((t) =>
    t.text.toUpperCase().includes(textoInicial)
  );
  const endIndex = data.findIndex((t) =>
    contem
      ? contains(normalize(t.text), textoFinalUpper)
      : t.text.toUpperCase().includes(textoFinal)
  );

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    return [];
  }
  return data.slice(startIndex, endIndex + 1);
};

export const groupItemsByYCoordinate = <T extends { y: number }>(
  items: T[],
  tolerance = 0.2
): Record<number, T[]> => {
  const rowsMap: Record<number, T[]> = {};

  items.forEach((item) => {
    const existingKey = Object.keys(rowsMap)
      .map(Number)
      .find((key) => Math.abs(key - item.y) <= tolerance);

    const yKey = existingKey ?? item.y;

    if (!rowsMap[yKey]) {
      rowsMap[yKey] = [];
    }

    rowsMap[yKey].push(item);
  });

  return rowsMap;
};

export const transformaTextoEmNumero = (
  n?: string,
  tipo: "int" | "float" = "int"
): number | null => {
  if (!n) return null;
  const cleaned = n.replace(/\./g, "").replace(",", ".");
  const parsed = tipo === "int" ? parseInt(cleaned, 10) : parseFloat(cleaned);
  return Number.isNaN(parsed) ? null : parsed;
};

export const trataLinhasQttPorTamanho = (
  tamanhoGradeDeTamanhos: number,
  linha: PdfText[],
  tamanhos: Tamanhos[]
) => {
  const qtts: CorQtts[] = new Array(tamanhoGradeDeTamanhos);
  for (let i = 0; i < tamanhoGradeDeTamanhos; i++) {
    const qtt = transformaTextoEmNumero(linha[i + 1]?.text);
    if (qtt === null) return ErroImportarPedido.ERRO_QTT_INVALIDO;
    const t = tamanhos[i];
    if (!t) return ErroImportarPedido.ERRO_LINHA_INVALIDA;
    qtts[i] = { tam: t.tam, qtt, ordem: t.ordem };
  }
  return qtts;
};

export const getValuesBeneathOptimized = (
  data: PdfText[],
  tolerance = 0.2
): PedidoResult => {
  const keywords = LISTAVALORES;
  const result = {} as PedidoResult;
  const bucketSize = tolerance * 2;
  const spatialIndex = new Map<number, PdfText[]>();

  for (const t of data) {
    const bucket = Math.floor(t.x / bucketSize);
    if (!spatialIndex.has(bucket)) {
      spatialIndex.set(bucket, []);
    }
    spatialIndex.get(bucket)!.push(t);
  }

  for (const keyword of keywords) {
    const upperKeyword = keyword.toUpperCase();

    const header = data.find((t) =>
      t.text.toUpperCase().includes(upperKeyword)
    );

    if (!header) {
      const chave = keywordToKey[keyword];
      result[chave] = null;
      continue;
    }

    const headerBucket = Math.floor(header.x / bucketSize);
    const bucketsToCheck = [headerBucket - 1, headerBucket, headerBucket + 1];

    let closest: PdfText | null = null;
    let minY = Infinity;

    for (const bucket of bucketsToCheck) {
      const items = spatialIndex.get(bucket);
      if (!items) continue;

      for (const t of items) {
        if (
          t.x >= header.x - tolerance &&
          t.x <= header.x + tolerance &&
          t.y > header.y &&
          t.y < minY
        ) {
          closest = t;
          minY = t.y;
        }
      }
    }

    const chave = keywordToKey[keyword];
    result[chave] = closest?.text ?? null;
  }

  return result;
};

export const trataPedidoPrincipal = (
  dados: Record<number, PdfText[]>
): ErroImportarPedido | ResultadoPedido => {
  const keys = Object.keys(dados);
  const qttLinhas = keys.length;

  if (qttLinhas < 3) return ErroImportarPedido.ERRO_TEM_QUE_TER_MAIS_3_LINHAS;

  keys.sort((a, b) => Number(a) - Number(b));

  const primeiraLinha = dados[Number(keys[0])];
  const ultimaLinha = dados[Number(keys[qttLinhas - 1])];

  if (!primeiraLinha) return ErroImportarPedido.ERRO_PRIMEIRA_LINHA;

  if (!ultimaLinha) {
    return ErroImportarPedido.ERRO_ULTIMA_LINHA;
  }

  const tamanhoGradeDeTamanhos = primeiraLinha.length - 2;

  if (tamanhoGradeDeTamanhos <= 0)
    return ErroImportarPedido.ERRO_GRADE_DE_TAMAMHOS_TEM_QUE_EXISTIR;

  if (ultimaLinha.length !== tamanhoGradeDeTamanhos + 2)
    return ErroImportarPedido.ERRO_ULTIMA_NAO_COMPATIVEL_GRADE_DE_TAMANHOS;

  const tamanhos: Tamanhos[] = new Array(tamanhoGradeDeTamanhos);

  for (let i = 0; i < tamanhoGradeDeTamanhos; i++) {
    const item = primeiraLinha[i + 1];
    if (!item) return ErroImportarPedido.ERRO_LINHA_INVALIDA;
    tamanhos[i] = { tam: item.text, ordem: i + 1 };
  }

  const numeroLinhasNacor = qttLinhas - 2;
  if (numeroLinhasNacor === 0)
    return ErroImportarPedido.ERRO_NAO_TEM_LINHAS_NA_COR;

  const totaisCores: QttPorCor[] = new Array(numeroLinhasNacor);

  for (let lineIdx = 0; lineIdx < numeroLinhasNacor; lineIdx++) {
    const l = dados[Number(keys[lineIdx + 1])];

    if (!l) return ErroImportarPedido.ERRO_LINHA_INVALIDA;

    if (l.length !== tamanhoGradeDeTamanhos + 2)
      return ErroImportarPedido.ERRO_LINHA_NAO_COMPATIVEL_GRADE_DE_TAMANHOS;

    const cor = l[0]?.text;
    if (!cor) return ErroImportarPedido.ERRO_COR_OU_TOTAL_INVALIDO;

    const qtts = trataLinhasQttPorTamanho(tamanhoGradeDeTamanhos, l, tamanhos);

    if (typeof qtts === "string") return qtts;

    const total = transformaTextoEmNumero(l[l.length - 1]?.text);
    if (total === null) return ErroImportarPedido.ERRO_QTT_INVALIDO;

    totaisCores[lineIdx] = { cor, qtts, total };
  }

  const qtts = trataLinhasQttPorTamanho(
    tamanhoGradeDeTamanhos,
    ultimaLinha,
    tamanhos
  );

  if (typeof qtts === "string") return qtts;

  const totalTotal = transformaTextoEmNumero(
    ultimaLinha[ultimaLinha.length - 1]?.text
  );

  if (totalTotal === null) return ErroImportarPedido.ERRO_TOTAL_GERAL_INVALIDO;

  return { pedidoCores: totaisCores, total: { qtts, total: totalTotal } };
};

export const tratoPedidosParciais = (dados: Record<number, PdfText[]>) => {
  const keys = Object.keys(dados);
  const qttLinhas = keys.length;

  keys.sort((a, b) => Number(a) - Number(b));

  const terceiraLinha = dados[Number(keys[2])];

  const pedido = terceiraLinha?.[0]?.text;

  const pedidoLimpo = pedido?.replace(/\s*\/.*$/, "");

  const nParcial = terceiraLinha?.[1]?.text;
  const nParcialLimpo = Number(nParcial?.match(/\d+/)?.[0] ?? 0);

  const dataParcial = terceiraLinha?.[4]?.text;

  const dataParcialTratada = parseDDMMYYYY(dataParcial);

  if (!pedidoLimpo || nParcialLimpo === 0 || !dataParcialTratada)
    return ErroImportarPedido.ERRO_NA_PRIMEIRA_LINHA_DO_PARCIAL;

  const selectedKeys = keys.slice(3, qttLinhas - 1);
  const result: Record<number, PdfText[]> = Object.fromEntries(
    selectedKeys.map((k) => [Number(k), dados[Number(k)]])
  ) as Record<number, PdfText[]>;

  if (!result || result === undefined)
    return ErroImportarPedido.ERRO_NA_QUANTIDADE_DO_PARCIA;

  const parcial = trataPedidoPrincipal(result);

  if (typeof parcial === "string") return parcial;

  const ultimaLinhaPreco = dados[Number(keys[qttLinhas - 1])]?.[1]?.text;

  const valorPrecoPeca = ultimaLinhaPreco?.replace(" EUR", "");

  const precoFinal = transformaTextoEmNumero(valorPrecoPeca, "float");

  if (precoFinal === null)
    return ErroImportarPedido.ERRO_TEM_QUE_TER_PRECO_NO_PARCIAL;

  return {
    pedido: pedidoLimpo,
    nParcial: nParcialLimpo,
    dataParcial: dataParcialTratada,
    precoParcial: precoFinal,
    parcial,
  };
};

function parseDDMMYYYY(dateStr: string | undefined): Date | undefined {
  if (!dateStr) return undefined;

  const [day, month, year] = dateStr.split("/");

  if (!day || !month || !year) return undefined;

  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}
