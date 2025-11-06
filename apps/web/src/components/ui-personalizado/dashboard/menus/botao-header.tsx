"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { useSidebar } from "../sidebar-modificada";

const BotaoHeader = () => {
  const { isMobile, state, openMobile } = useSidebar();
  //console.log(isMobile, state, openMobile);

  if ((isMobile && openMobile) || (state === "expanded" && !isMobile))
    return (
      <Link href="/dashboard">
        <div className="flex flex-row gap-3">
          <div className="flex aspect-square items-center justify-center rounded-lg">
            <Image
              src="/favicon.ico"
              alt="Favicon"
              width={32} // Set width
              height={32} // Set height
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Fmoda</span>
            <span className="truncate text-xs">Indústria têxtil S.A.</span>
          </div>
        </div>
      </Link>
    );

  return (
    <Link href="/dashboard">
      <Image
        src="/favicon.ico"
        alt="Favicon"
        width={32} // Set width
        height={32} // Set height
      />
    </Link>
  );
};

export default BotaoHeader;
