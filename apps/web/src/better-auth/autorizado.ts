import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "./auth";

export async function authorizePapelOrRedirect(papel: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/login");
  const papeis: string[] = session?.papeis || [];

  if (papel === "") return;

  //console.log("Papeis: ", papeis, papel, papeis.includes(papel));

  if (!papeis.includes(papel)) {
    redirect("/dashboard");
  }
}
