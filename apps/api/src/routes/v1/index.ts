import { Router } from "express";

import androidRoutes from "./android/index";
import qrcode from "./qrcode";
import tradutor from "./tradutor";

const routes = Router();

routes.use("/android", androidRoutes);
routes.use("/qrcode", qrcode);
routes.use("/tradutor", tradutor);

export default routes;
