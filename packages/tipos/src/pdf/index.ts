import z from "zod";

export const NPEDIDO = "Nº PED.";
export const TOTAL_PEDIDO = "TOTAL PEDIDO";
export const UNID_LOTE = "UNID. LOT.";
export const PEDIDO = "PEDIDO";
export const PRECIO_COSTE = "PRECIO COSTE:";
export const PAGINA = "página ";
export const ENTREGAS_PARCIALES = "ENTREGAS PARCIALES";
export type PdfText = {
  x: number;
  y: number;
  text: string;
};

export type Pdf2JsonText = {
  x: number;
  y: number;
  w: number;
  sw: number;
  A: string;
  R: { T: string }[];
};

export type Pdf2JsonPage = {
  Texts: Pdf2JsonText[];
  Width?: number;
  Height?: number;
};

export type Pdf2JsonData = {
  Pages: Pdf2JsonPage[];
  Meta?: Record<string, string | number | boolean | null>;
  Width?: number;
  Height?: number;
};

export type CorQtts = { tam: string; qtt: number; ordem: number };
export type QttPorCor = { cor: string; qtts: CorQtts[]; total: number };
export type Tamanhos = { tam: string; ordem: number };

export type ResultadoPedido = {
  pedidoCores: QttPorCor[];
  total: { qtts: CorQtts[]; total: number };
};

export const LISTAVALORES: Keyword[] = [
  "Nº PED.",
  "ARTÍCULO",
  "DESCRIPCIÓN",
  "TEMPORADA",
  "FECHA HANDOVER",
];

export const keywordToKey = {
  "Nº PED.": "Pedido",
  ARTÍCULO: "Modelo",
  DESCRIPCIÓN: "DescModelo",
  TEMPORADA: "Temporada",
  "FECHA HANDOVER": "dataEntrega",
} as const;

export type Keyword = keyof typeof keywordToKey;

export type PedidoResult = {
  [K in Keyword as (typeof keywordToKey)[K]]: string | null;
};

export enum ErroImportarPedido {
  ERRO_NO_CABECALHO_LISTA_VAZIA = "Cabeçalho devolve lista vazia",
  ERRO_TEM_QUE_TER_PRECO_ENTREGA_UNICA = "Tem que ter preço entrega única",
  ERRO_TEM_QUE_TER_PRECO_ENTREGA_UNICA_E_TRANSFORMAVEL = "Tem que ter preço entrega única e tranformavel..",
  ERRO_TEM_QUE_TER_PRECO_NO_PARCIAL = "Tem que ter preço no parcial",
  ERRO_TEM_QUE_TER_MAIS_3_LINHAS = "Tem que ter mais que 3 linhas",
  ERRO_GRADE_DE_TAMAMHOS_TEM_QUE_EXISTIR = "Grade de tamanhos tem que existir",
  ERRO_NAO_TEM_LINHAS_NA_COR = "Não tem linhas na cor...",
  ERRO_PRIMEIRA_LINHA = "Erro na primeira lina",
  ERRO_ULTIMA_LINHA = "Erro na última lina",
  ERRO_ULTIMA_NAO_COMPATIVEL_GRADE_DE_TAMANHOS = "Última linha não compatível com a grade de tamanhos",
  ERRO_LINHA_NAO_COMPATIVEL_GRADE_DE_TAMANHOS = "Linha não compatível com a grade de tamanhos",
  ERRO_LINHA_INVALIDA = "Linha inválida no PDF",
  ERRO_COR_OU_TOTAL_INVALIDO = "Cor ou total inválido",
  ERRO_QTT_INVALIDO = "Quantidade inválida",
  ERRO_TOTAL_GERAL_INVALIDO = "Total geral inválido",
  PEDIDO_PARCIAL_TEM_QUE_TER_MAIS_QUE_UMA_ENTREGA = "Pedido parcial tem que ter mais que uma entrega",
  ERRO_NA_PRIMEIRA_LINHA_DO_PARCIAL = "Erro na primeira linha do parcial",
  ERRO_NA_QUANTIDADE_DO_PARCIA = "Erro na quatidade do parcial",
  ERRO_NO_PARCIAL_TEM_QUE_EXISTIR_PELO_MENOS_UMA_ENTREGA = "No parcial tem que existir pelo menos uma entrega",
}

//zod type
const DetalhesPecaSchema = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("simples"),
    detalhesPeca: z.object({
      preco: z.number(),
      nPedido: z.string().nullable(),
      modelo: z.string().nullable(),
      descModelo: z.string().nullable(),
      temporada: z.string().nullable(),
      dataEntrega: z.string(),
      // pedido: ResultadoPedidoSchema,
    }),
  }),
  z.object({
    tipo: z.literal("parcial"),
    detalhesPeca: z.object({
      nPedido: z.string().nullable(),
      modelo: z.string().nullable(),
      descModelo: z.string().nullable(),
      temporada: z.string().nullable(),
      dataEntrega: z.null(),
      //pedido: ResultadoPedidoSchema,
      //parciais: z.array(/* ... */),
    }),
  }),
]);
