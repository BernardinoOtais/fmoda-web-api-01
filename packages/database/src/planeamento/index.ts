import { deleteDataEQttBd } from "./delete/delete-data-e-qtt";
import { deleteFornecedorValorizadoBd } from "./delete/delete-fornecedores-valores";
import { getClientesBd } from "./get/get-clientes";
import { getFornecedoresBd } from "./get/get-fornecedores";
import { getOpAbertasDb } from "./get/get-op-abertas";
import { getOpCamioesEnviosDb } from "./get/get-op-camioes-envios";
import { getPlaneamentoViaOrcamentoDb } from "./get/get-planeamento-via-orc";
import { getPlaneamentosDb } from "./get/get-planeamentos";
import { postDePlaneamentosDB } from "./post/post-de-palneamentos";
import { postObsDb } from "./post/post-obs";
import { upsertDataEValorDb } from "./upsert/upsert-data-e-qtt";
import { upsertDescValorDb } from "./upsert/upsert-desc-valor";

export {
  getOpAbertasDb,
  getClientesBd,
  getFornecedoresBd,
  getPlaneamentosDb,
  getOpCamioesEnviosDb,
  getPlaneamentoViaOrcamentoDb,
  postDePlaneamentosDB,
  postObsDb,
  deleteFornecedorValorizadoBd,
  upsertDescValorDb,
  upsertDataEValorDb,
  deleteDataEQttBd,
};
