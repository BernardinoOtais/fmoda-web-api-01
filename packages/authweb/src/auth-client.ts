import {
  customSessionClient,
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL,
  trustedOrigins: process.env.TRUSTED_ORIGINS?.split(",") ?? [],
  plugins: [
    inferAdditionalFields<typeof auth>(),
    customSessionClient<typeof auth>(),
    usernameClient(),
  ],
});
