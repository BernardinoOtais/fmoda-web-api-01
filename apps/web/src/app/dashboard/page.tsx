import { getSession } from "@repo/authweb/session";
import { redirect } from "next/navigation";
import React from "react";

const nomes = ["joana", "fernanda", "bernardino"];
const DashBoard = async () => {
  const session = await getSession();
  const user = session?.user?.name;
  if (user && nomes.includes(session.user.name.toLowerCase())) {
    return user === "Bernardino"
      ? redirect("/dashboard/joana")
      : redirect(`/dashboard/${user.toLowerCase()}`);
  }
  return <div>Dashboard</div>;
};

export default DashBoard;
