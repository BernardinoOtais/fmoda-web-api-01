import { betterAuth } from "better-auth";
import { options } from "./auth-options";

export const auth = betterAuth({
  ...options,
  plugins: [...(options.plugins ?? [])],
});
