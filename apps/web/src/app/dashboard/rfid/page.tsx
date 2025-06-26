import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import React from "react";

const Rfid = async () => {
  await authorizePapelOrRedirect("Rfid");
  return <div>Rfid</div>;
};

export default Rfid;
