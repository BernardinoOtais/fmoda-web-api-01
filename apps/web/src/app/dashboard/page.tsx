import { auth } from "@/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const DashBoard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session) redirect("/auth/login");
  return <div>{JSON.stringify(session, null, 2)}</div>;
};

export default DashBoard;
