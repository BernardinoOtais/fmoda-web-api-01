import z from "zod";

import { DateSchema } from "..";

import {
  FloatSchema,
  NumeroInteiroMaiorQueZero,
  StringComTamanhoSchema,
} from "@/comuns";

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

export const CorQttsSchema = z.object({
  tam: StringComTamanhoSchema(10, 1),
  qtt: NumeroInteiroMaiorQueZero,
  ordem: NumeroInteiroMaiorQueZero,
});

export const QttPorCorSchema = z.object({
  cor: StringComTamanhoSchema(25, 1),
  qtts: z.array(CorQttsSchema),
  total: NumeroInteiroMaiorQueZero,
});

export const TamanhosSchema = z.object({
  tam: StringComTamanhoSchema(10, 1),
  ordem: NumeroInteiroMaiorQueZero,
});

export const ResultadoPedidoSchema = z.object({
  pedidoCores: z.array(QttPorCorSchema),
  total: z.object({
    qtts: z.array(CorQttsSchema),
    total: NumeroInteiroMaiorQueZero,
  }),
});

export const DadosParciaisSchema = z.object({
  pedido: StringComTamanhoSchema(25, 1),
  nParcial: NumeroInteiroMaiorQueZero,
  dataParcial: DateSchema,
  precoParcial: FloatSchema,
  parcial: z.array(ResultadoPedidoSchema),
});
// Infer TypeScript types from schemas
export type CorQtts = z.infer<typeof CorQttsSchema>;
export type QttPorCor = z.infer<typeof QttPorCorSchema>;
export type Tamanhos = z.infer<typeof TamanhosSchema>;
export type ResultadoPedido = z.infer<typeof ResultadoPedidoSchema>;

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

//Hm

export enum ErroImportarPedidoHm {
  ERRO_HM_CABECALHOS_DIFERENTES = "Cabeçalhos diferentes",
  ERRO_HH_CABECALHO_TEM_QUE_TER_NOVE_LINHAS = "Cabeçalho tem que tem 9 linhas...",
}

export type TipoCamposDinamicos = Record<string, string | number>;
export type Campos = {
  nome: string;
  key: string;
};

export const campoCabecalhoHm: Campos[] = [
  { nome: "Order No:", key: "orderNo" },
  { nome: "Product No:", key: "prodNo" },
  { nome: "PT Prod No:", key: "ptProdNo" },
  { nome: "Product Name:", key: "prodName" },
  { nome: "Date of Order:", key: "dateOfOrder" },
  { nome: "Product Description:", key: "prodDesc" },
  { nome: "Supplier Code:", key: "supplierCode" },
  { nome: "Season:", key: "season" },
  { nome: "Supplier Name:", key: "supplierName" },
  { nome: "Customs Customer Group:", key: "customsCustomerGroup" },
  { nome: "Option No:", key: "optionNo" },
  { nome: "Type of Construction:", key: "typeOfConstroction" },
  { nome: "Development No:", key: "developmentNo" },
];

export const campoArticleHm: Campos[] = [
  { nome: "Article No:", key: "artNo" },
  { nome: "H&M Colour Code:", key: "hmColourCod" },
  { nome: "Colour Name:", key: "colourName" },
  { nome: "Description:", key: "description" },
  { nome: "PT Article Number:", key: "ptArtNumber" },
  { nome: "Option No:", key: "optionNo" },
];

export const campoTotaisAssortments: Campos[] = [
  { nome: "Quantity:", key: "nPecasSortido" },
  { nome: "No of Asst:", key: "nSortidos" },
  { nome: "Pcs:", key: "ttPecas" },
];

export const campoTotalTotal: Campos[] = [{ nome: "Quantity:", key: "total" }];

/* ---------- Shared primitives ---------- */

const toInt = z.preprocess((val) => {
  if (typeof val === "string") {
    const cleaned = val.replace(/\s+/g, "");
    return cleaned;
  }
  return val;
}, z.coerce.number().int());

const SizeQuantitySchema = z.object({
  tam: z.string().min(1),
  qtt: z.number().int().nonnegative(),
});
export type SizeQuantityDto = z.infer<typeof SizeQuantitySchema>;

const TotalSchema = z.object({
  total: toInt,
});

/* ---------- Header ---------- */

export const LinhasCabecalhoSchema = z.object({
  orderNo: z.string().min(1),
  prodNo: z.string().min(1),
  ptProdNo: z.string().min(1),
  prodName: z.string().min(1),
  dateOfOrder: z.string().min(1), // can be refined to date later
  prodDesc: z.string().min(1),
  supplierCode: z.string().min(1),
  season: z.string().min(1),
  supplierName: z.string().min(1),
  customsCustomerGroup: z.string().min(1),
  optionNo: z.string().min(1),
  typeOfConstroction: z.string().min(1),
  developmentNo: z.string().min(1),
});

/* ---------- Destino ---------- */

const DestinoSchema = z.object({
  destino: z.string().min(1),
  dCod: z.string().min(1),
});

/* ---------- Artigo ---------- */

const ArtigoSchema = z.object({
  artNo: z.string().min(1),
  hmColourCod: z.string().min(1),
  colourName: z.string().min(1),
  description: z.string().min(1),
  ptArtNumber: z.string().min(1),
  optionNo: z.string().min(1),
});

/* ---------- Assortment ---------- */

export const TotalAsSchema = z.object({
  nPecasSortido: toInt,
  nSortidos: toInt,
  ttPecas: toInt,
});

const AssortmentSchema = z.object({
  assort: z.array(SizeQuantitySchema),
  totalAs: TotalAsSchema,
});

/* ---------- Single ---------- */

const SingleSchema = z.object({
  dist: z.array(SizeQuantitySchema),
  totalsSingle: TotalSchema,
});

/* ---------- Total ---------- */

const TotalDistSchema = z.object({
  dist: z.array(SizeQuantitySchema),
  total: TotalSchema,
});

/* ---------- Encomenda Item ---------- */

export const DadosDestinoItemSchema = z.object({
  destino: DestinoSchema,
  arttigo: ArtigoSchema,
  assortment: AssortmentSchema,
  single: SingleSchema,
  total: TotalDistSchema,
});

/* ---------- Root ---------- */

export const EncomendaSchema = z.object({
  encomenda: z.object({
    linhasCabecalho: LinhasCabecalhoSchema,
    dadosDestino: z.array(DadosDestinoItemSchema),
  }),
});

export type EncomendaHMDto = z.infer<typeof EncomendaSchema>;
