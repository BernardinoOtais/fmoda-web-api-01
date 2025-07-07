import React from "react";

import { useSidebar } from "../sidebar-modificada";
import BotaoHeader from "./botao-header";

import { Button } from "@/components/ui/button";

const FmodaIcon = () => {
  const { isMobile } = useSidebar();

  if (isMobile)
    return (
      <Button size="lg" asChild>
        <BotaoHeader />
      </Button>
    );
};

export default FmodaIcon;
