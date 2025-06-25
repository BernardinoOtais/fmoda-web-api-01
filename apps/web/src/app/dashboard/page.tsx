import { authorizePapelOrRedirect } from "@/better-auth/autorizado";
import React from "react";

const DashBoard = async () => {
  await authorizePapelOrRedirect("");
  return <div>Dashboard</div>;
};

export default DashBoard;
