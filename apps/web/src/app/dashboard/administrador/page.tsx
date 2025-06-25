import { authorizePapelOrRedirect } from "@/better-auth/autorizado";
import React from "react";
import { TrpcTest } from "./trpc-test";

const Administrador = async () => {
  await authorizePapelOrRedirect("Administrador");
  return <TrpcTest />;
};

export default Administrador;
