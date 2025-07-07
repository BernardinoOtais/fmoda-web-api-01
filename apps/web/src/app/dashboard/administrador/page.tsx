import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import React from "react";

import { TrpcTest } from "./trpc-test";

const Administrador = async () => {
  await authorizePapelOrRedirect("Administrador");
  return <TrpcTest />;
};

export default Administrador;
