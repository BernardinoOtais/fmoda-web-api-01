import { server } from "@config/config";

import app from "./app";

const environment = process.env.NODE_ENV ?? "development"; // Default to 'development' if NODE_ENV is not set
console.log(process.env.CENAS);

app.listen(server.SERVER_PORT, () => {
  console.log(`SPorta ${server.SERVER_PORT} in ${environment} mode`);
});
