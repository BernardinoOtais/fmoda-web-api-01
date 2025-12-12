"use client";

import { authClient } from "@repo/authweb/authClient";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const signOut = async () => {
      try {
        await authClient.signOut(); // ✔ this is enough
        router.replace("/auth/login"); // ✔ redirect manually
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    signOut();
  }, [router]);

  return <div>Logging out...</div>;
};

export default Logout;
