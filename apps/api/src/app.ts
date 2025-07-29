import { server } from "@config/config";
import { catchAll } from "@middlewares/catch-all";
import { corsHandler } from "@middlewares/cors-handler";
import { requestLogger } from "@middlewares/logger";
import v1Routes from "@routes/v1";
import { parseAPIVersion } from "@utils/utils";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";

// Criar a aplicação Express
const app = express();

/**
 * Middlewares principais para análise de requisições e cookies.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Security enhancements and rate limiting.
 */

/**
 * Ativar o suporte a CORS (Cross-Origin Resource Sharing).
 */
app.use(corsHandler(server.ALLOWED_ORIGINS));

/**
 * Registar pedidos recebidos.
 */
app.use(requestLogger());

/**
 * Configuração das rotas.
 */
app.use(parseAPIVersion(1), v1Routes);

/**
 * Tratamento para rotas não definidas.
 */
app.use(catchAll);

export default app;
