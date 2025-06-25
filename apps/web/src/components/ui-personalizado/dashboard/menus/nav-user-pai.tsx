import { redirect } from "next/navigation";
import React from "react";

import { getSession } from "@/better-auth/session";
import { NavUser } from "./nav-user-modificado";

const NavUserPai = async () => {
  const utilizadorActual = await getSession();

  if (!utilizadorActual) return redirect("/");
  //await espera(3);
  return (
    <NavUser
      name={utilizadorActual.user.name}
      apelido={utilizadorActual.user.apelido}
      email={utilizadorActual.user.email}
      avatar={""}
    />
  );
};

export default NavUserPai;
