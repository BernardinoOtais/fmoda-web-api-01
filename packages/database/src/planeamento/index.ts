import { deleteDataEQuantidadeBd } from "./delete/delete-data-e-quantidade";
import { getClientesBd } from "./get/get-clientes";
import { getFornecedoresBd } from "./get/get-fornecedores";
import { getOpAbertasDb } from "./get/get-op-abertas";
import { getOpCamioesEnviosDb } from "./get/get-op-camioes-envios";
import { getPlaneamentoViaOrcamentoDb } from "./get/get-planeamento-via-orc";
import { getPlaneamentosDb } from "./get/get-planeamentos";
import { patchDePlaneamentoDataEQttDb } from "./patch/patch-de-planeamento-data-e-qtt";
import { postDePlaneamentosDB } from "./post/post-de-palneamentos";
import { postDePlaneamentoDataEQttDb } from "./post/post-de-planeamento-data-e-qtt";
import { postFornecedorDb } from "./post/post-fornecedor";
import { postObsDb } from "./post/post-obs";

export {
  getOpAbertasDb,
  getClientesBd,
  getFornecedoresBd,
  getPlaneamentosDb,
  getOpCamioesEnviosDb,
  getPlaneamentoViaOrcamentoDb,
  postDePlaneamentosDB,
  postFornecedorDb,
  deleteDataEQuantidadeBd,
  postDePlaneamentoDataEQttDb,
  patchDePlaneamentoDataEQttDb,
  postObsDb,
};
