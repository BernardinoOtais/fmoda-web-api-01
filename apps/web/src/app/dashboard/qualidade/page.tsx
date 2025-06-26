import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import React from "react";

const Qualidade = async () => {
  await authorizePapelOrRedirect("Qualidade");
  return <div>Qualidade</div>;
};

export default Qualidade;
