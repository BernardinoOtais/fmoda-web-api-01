import { getPapeisDb } from "./get/get-papeis";
import { getUserPapeisDb } from "./get/get-user-papeis";
import { getUsersDb } from "./get/get-users";
import { patchPapeisDeUserDb } from "./patch/patch-papeis-de-user";
import { postAlteroPassword } from "./post/post-altero-password";
import { postPapeisDb } from "./post/post-papeis";

export {
  getPapeisDb,
  getUsersDb,
  getUserPapeisDb,
  postPapeisDb,
  postAlteroPassword,
  patchPapeisDeUserDb,
};
