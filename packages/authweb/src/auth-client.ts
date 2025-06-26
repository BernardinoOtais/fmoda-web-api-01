import { createAuthClient } from "better-auth/react";
import {
  customSessionClient,
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [
    inferAdditionalFields<typeof auth>(),
    customSessionClient<typeof auth>(),
    usernameClient(),
  ],
});
