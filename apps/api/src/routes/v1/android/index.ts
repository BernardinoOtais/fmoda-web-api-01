import { Router } from "express";

import authRoutes from "./auth";
import routesEspeciais from "./especial";
import routesImagem from "./imagem";
import routesCortes from "./lotes";
import routesMarrocos from "./marrocos";
import routesResumo from "./resumo";

const androidRoutes = Router();

androidRoutes.use("/auth/", authRoutes);

androidRoutes.use("/especial/", routesEspeciais);

androidRoutes.use("/marrocos/", routesMarrocos);

androidRoutes.use("/cortes/", routesCortes);

androidRoutes.use("/resumo/", routesResumo);

androidRoutes.use("/imagem/", routesImagem);

export default androidRoutes;
