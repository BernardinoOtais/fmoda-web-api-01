import {
  CorQtts,
  ErroImportarPedido,
  PdfText,
  Tamanhos,
} from "@repo/tipos/pdf";

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
