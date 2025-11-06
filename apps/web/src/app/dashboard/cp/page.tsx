import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { PAPEL_CP } from "@repo/tipos/consts";
import React from "react";

import PlaneamentoGeralReport from "./planeamento-geral-report";

const CpReports = async () => {
  await authorizePapelOrRedirect(PAPEL_CP);
  return <PlaneamentoGeralReport />;
};

export default CpReports;
