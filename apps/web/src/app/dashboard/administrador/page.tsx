import { authorizePapelOrRedirect } from "@/better-auth/autorizado";
import React from "react";

const Administrador = async () => {
  await authorizePapelOrRedirect("Administrador");
  return <div>Administrador</div>;
};

export default Administrador;
