import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import React from "react";

const DashBoard = async () => {
  await authorizePapelOrRedirect("");
  return <div>Dashboard</div>;
};

export default DashBoard;
