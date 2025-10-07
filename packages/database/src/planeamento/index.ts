import { getClientesBd } from "./get/get-clientes";
import { getFornecedoresBd } from "./get/get-fornecedores";
import { getOpAbertasDb } from "./get/get-op-abertas";
import { getOpCamioesEnviosDb } from "./get/get-op-camioes-envios";
import { getPlaneamentosDb } from "./get/get-planeamentos";
import { postDataDb } from "./post/post-data";
import { postDePlaneamentosDB } from "./post/post-de-palneamentos";
import { postFornecedorDb } from "./post/post-fornecedor";
import { postQttDb } from "./post/post-qtt";

export {
  getOpAbertasDb,
  getClientesBd,
  getFornecedoresBd,
  getPlaneamentosDb,
  getOpCamioesEnviosDb,
  postDePlaneamentosDB,
  postFornecedorDb,
  postDataDb,
  postQttDb,
};
