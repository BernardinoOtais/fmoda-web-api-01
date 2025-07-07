"use client";
import React from "react";

import { useSidebar } from "../sidebar-modificada";
import FmodaIcon from "./fmoda-icon";

import { ModeToggle } from "@/components/utils/mode-toggle";

const HeaderRight = () => {
  const { openMobile } = useSidebar();

  if (!openMobile) {
    return (
      <div className="flex flex-1 flex-row items-center justify-end">
        <FmodaIcon />
        <ModeToggle />
      </div>
    );
  }
};

export default HeaderRight;
