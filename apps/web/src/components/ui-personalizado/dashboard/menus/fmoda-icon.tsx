import React from "react";

import { Button } from "@/components/ui/button";

import { useSidebar } from "../sidebar-modificada";
import BotaoHeader from "./botao-header";

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
