import { server } from "@config/config";

import app from "./app";

const environment = process.env.NODE_ENV ?? "development"; // Default to 'development' if NODE_ENV is not set

app.listen(server.SERVER_PORT, () => {
  console.log(
    `Server is running on port ${server.SERVER_PORT} in ${environment} mode`
  );
});
