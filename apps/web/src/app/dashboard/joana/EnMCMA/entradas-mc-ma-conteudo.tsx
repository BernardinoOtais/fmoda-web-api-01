"use client";
import { useSuspenseQuery } from "@repo/trpc";
import React, { useEffect, useState } from "react";

import MalhaMobile from "./malha-mobile";
import MalhaWeb from "./malha-web";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

const EntradasMCMAConteudo = () => {
  const trpc = useTRPC();

  const [searchOp, setSearchOp] = useState<string>("");
  const debouncedOp = useDebounce(searchOp, 1500);
  const opValue = debouncedOp.trim() === "" ? null : Number(debouncedOp);

  const { data } = useSuspenseQuery(
    trpc.joanaEntradasMcMa.getEntradasMcMa.queryOptions({ op: opValue })
  );

  const [filtered, setFiltered] = useState(data);

  useEffect(() => {
    setFiltered(data);
  }, [data]);

  return (
    <>
      <header>
        <div className="flex flex-row ml-auto items-center pb-1">
          <span className="ml-auto px-1">Op :</span>
          <Input
            placeholder="Pesquisar por op..."
            value={searchOp}
            onChange={(e) => setSearchOp(e.target.value)}
            className="w-44"
          />
        </div>
      </header>

      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="flex w-full flex-col items-center gap-1 overflow-auto">
            <>
              {/* MOBILE / TABLET version (< lg) */}
              <div className="block lg:hidden w-full  flex-col">
                <MalhaMobile dados={filtered} />
              </div>

              {/* DESKTOP version (>= lg) */}
              <div className="hidden w-full lg:block">
                <MalhaWeb dados={filtered} />
              </div>
            </>
          </div>
        </div>
      </main>
    </>
  );
};

export default EntradasMCMAConteudo;
