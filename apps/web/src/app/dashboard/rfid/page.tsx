import { authorizePapelOrRedirect } from "@/better-auth/autorizado";
import React from "react";

const Rfid = async () => {
  await authorizePapelOrRedirect("Rfid");
  return <div>Rfid</div>;
};

export default Rfid;
