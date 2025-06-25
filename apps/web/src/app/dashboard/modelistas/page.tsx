import { authorizePapelOrRedirect } from "@/better-auth/autorizado";
import React from "react";

const Modelistas = async () => {
  await authorizePapelOrRedirect("Modelistas");
  return <div>Modelistas</div>;
};

export default Modelistas;
