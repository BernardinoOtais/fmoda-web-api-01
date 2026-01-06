import { redirect } from "next/navigation";

import { getSession } from "./session";

export async function authorizePapelOrRedirect(papel: string) {
  //console.log("Funcao p[rotegePapeis : ");
  const session = await getSession();
  //console.log("authorizePapelOrRedirect : ", session);

  if (!session) {
    redirect("/auth/logout");
  }

  const papeis: string[] = session?.papeis || [];

  //console.log("Papeis: ", papeis, papel, papeis.includes(papel));
  if (papel === "") return;

  //console.log("Papeis: ", papeis, papel, papeis.includes(papel));

  if (!papeis.includes(papel) && !papeis.includes("Fernanda")) {
    redirect("/dashboard");
  }
}
