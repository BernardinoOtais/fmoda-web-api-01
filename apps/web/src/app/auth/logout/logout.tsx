"use client";
import { authClient } from "@repo/authweb/authClient";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Logout = () => {
  const router = useRouter();
  useEffect(() => {
    // Immediately log out when component mounts
    const signOut = async () => {
      try {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.replace("/auth/login");
            },
          },
        });
      } catch (error) {
        console.error("Logout failed", error);
      }
    };

    signOut();
  }, [router]);

  return <div>Logging out...</div>;
};

export default Logout;
