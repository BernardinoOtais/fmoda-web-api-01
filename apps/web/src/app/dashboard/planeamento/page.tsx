import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import React from "react";

const Planeamento = async () => {
  await authorizePapelOrRedirect("Planeamento");
  return <div>Planeamento</div>;
};

export default Planeamento;
