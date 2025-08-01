import v1Routes from "@routes/v1";
import { parseAPIVersion } from "@utils/utils";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";

// Create Express app
const app = express();

/**
 * Core middlewares for parsing and cookies.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Route handling.
 */
app.use(parseAPIVersion(1), v1Routes);

/**
 * Fallback for undefined routes.
 */

export default app;
