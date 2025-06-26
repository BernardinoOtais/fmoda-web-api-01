import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import React from "react";

const Modelistas = async () => {
  await authorizePapelOrRedirect("Modelistas");
  return <div>Modelistas</div>;
};

export default Modelistas;
