import dotenv from 'dotenv';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;
const DEVELOPMENT = NODE_ENV === 'development';

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME ?? 'localhost';
const SERVER_PORT = process.env.PORT
  ? Number(process.env.PORT)
  : Number(process.env.DEFAULT_SERVER_PORT);

const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000'
).split(',');

const API_URI = process.env.API_URI;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;
const REFRESH_JWT_EXPIRES_IN = process.env.REFRESH_JWT_EXPIRES_IN;

export const server = {
  SERVER_HOSTNAME,
  SERVER_PORT,
  ALLOWED_ORIGINS,
  DEVELOPMENT,
  API_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_JWT_SECRET,
  REFRESH_JWT_EXPIRES_IN,
  NODE_ENV,
};
