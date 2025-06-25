import { Separator } from "@radix-ui/react-separator";
import React from "react";

import { SidebarTrigger } from "../sidebar-modificada";
import BreadCrumb from "./bread-crumbs";
import HeaderRight from "./header-right";

const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <BreadCrumb />
      </div>
      <HeaderRight />
    </header>
  );
};

export default Header;
