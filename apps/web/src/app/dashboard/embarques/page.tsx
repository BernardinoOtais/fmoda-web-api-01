import { authorizePapelOrRedirect } from "@/better-auth/autorizado";
import React from "react";

const Embarques = async () => {
  await authorizePapelOrRedirect("Emabarques");
  return <div>Embarques</div>;
};

export default Embarques;
