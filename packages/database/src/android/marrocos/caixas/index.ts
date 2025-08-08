import { deleteCaixaEDevolveLista } from "./delete/delete-caixa-e-devolve-lista";
import { deleteCaixaMasDeixaCaixa } from "./delete/delete-caixa-mas-deixa-caixa";
import { deleteCaixasEDevolveLista } from "./delete/delete-caixas-e-devolve-lista";
import { getCaixas } from "./get/get-caixas";
import { getResetNumeroCaixas } from "./get/get-reset-numero-caixas";
import { patchQuantidadeCaixa } from "./patch/patch-quantidade-caixa";
import { postJuntaCaixas } from "./post/post-junta-caixas";
import { postNovaCaixa } from "./post/post-nova-caixa";
import { postSubstituiCaixa } from "./post/post-substitui-caixa";

export {
  getCaixas,
  getResetNumeroCaixas,
  postJuntaCaixas,
  postNovaCaixa,
  postSubstituiCaixa,
  deleteCaixaEDevolveLista,
  deleteCaixaMasDeixaCaixa,
  deleteCaixasEDevolveLista,
  patchQuantidadeCaixa,
};
