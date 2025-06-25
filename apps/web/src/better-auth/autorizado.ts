import { redirect } from "next/navigation";

import { getSession } from "./session";

export async function authorizePapelOrRedirect(papel: string) {
  //console.log("Funcao p[rotegePapeis : ");
  const session = await getSession();

  if (!session) redirect("/auth/login");
  const papeis: string[] = session?.papeis || [];

  //console.log("Papeis: ", papeis, papel, papeis.includes(papel));
  if (papel === "") return;

  //console.log("Papeis: ", papeis, papel, papeis.includes(papel));

  if (!papeis.includes(papel)) {
    redirect("/dashboard");
  }
}
