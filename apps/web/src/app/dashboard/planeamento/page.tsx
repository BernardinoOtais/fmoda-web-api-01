import { authorizePapelOrRedirect } from "@/better-auth/autorizado";
import React from "react";

const Planeamento = async () => {
  await authorizePapelOrRedirect("Planeamento");
  return <div>Planeamento</div>;
};

export default Planeamento;
