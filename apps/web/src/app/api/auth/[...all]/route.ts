import { toNextJsHandler } from "@repo/authweb";
import { auth } from "@repo/authweb/auth";

export const { POST, GET } = toNextJsHandler(auth);
