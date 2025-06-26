import { auth } from "@repo/authweb/auth";
import { toNextJsHandler } from "@repo/authweb";

export const { POST, GET } = toNextJsHandler(auth);
