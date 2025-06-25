import { authorizePapelOrRedirect } from "@/better-auth/autorizado";
import React from "react";

const Embarques = async () => {
  console.log("Embarques");
  await authorizePapelOrRedirect("Embarques");
  return <div>Embarques</div>;
};

export default Embarques;
