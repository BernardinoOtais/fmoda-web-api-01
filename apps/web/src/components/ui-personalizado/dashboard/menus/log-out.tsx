"use client";
import { authClient } from "@repo/authweb/authClient";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const LogOutBotao = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleClick() {
    await authClient.signOut({
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("Até breve....!");
          router.replace("/auth/login");
        },
      },
    });
  }
  return (
    <DropdownMenuItem onClick={handleClick} disabled={isPending}>
      <LogOut />
      Log out
    </DropdownMenuItem>
  );
};

export default LogOutBotao;
