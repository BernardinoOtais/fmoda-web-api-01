import { deleteDataEQttBd } from "./delete/delete-data-e-qtt";
import { deleteFornecedorValorizadoBd } from "./delete/delete-fornecedores-valores";
import { deleteOpLotesBd } from "./delete/delete-op-lotes";
import { getClientesBd } from "./get/get-clientes";
import { getFornecedoresBd } from "./get/get-fornecedores";
import { getOpAbertasDb } from "./get/get-op-abertas";
import { getOpCamioesEnviosDb } from "./get/get-op-camioes-envios";
import { getOpLotesDb } from "./get/get-op-lotes";
import { getOpLotesDistDb } from "./get/get-op-lotes-dist";
import { getPlaneamentoViaOrcamentoDb } from "./get/get-planeamento-via-orc";
import { getPlaneamentosDb } from "./get/get-planeamentos";
import { postDePlaneamentosDB } from "./post/post-de-palneamentos";
import { postObsDb } from "./post/post-obs";
import { postOpLotesDb } from "./post/post-op-lotes";
import { upsertDataEValorDb } from "./upsert/upsert-data-e-qtt";
import { upsertDescValorDb } from "./upsert/upsert-desc-valor";
import { upsertOpLotesDb } from "./upsert/upsert-op-lotes";

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
  getOpLotesDb,
  upsertOpLotesDb,
  getOpLotesDistDb,
  postOpLotesDb,
  deleteOpLotesBd,
};
