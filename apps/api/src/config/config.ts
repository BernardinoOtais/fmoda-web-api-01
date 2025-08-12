import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;
const DEVELOPMENT = process.env.NODE_ENV ?? "development";

const IP_PERMITIDO = process.env.ALLOWED_IP;

const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ?? "http://localhost:3000"
).split(",");

const API_URI = process.env.API_URI;

const IMAGE_PATH = process.env.IMAGE_PATH;

export const server = {
  SERVER_PORT,
  ALLOWED_ORIGINS,
  DEVELOPMENT,
  API_URI,
  NODE_ENV,
  IMAGE_PATH,
  IP_PERMITIDO,
};
