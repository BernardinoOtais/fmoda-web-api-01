"use client";
import { useSuspenseQuery } from "@repo/trpc";
import React, { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

const EstampadosEBordados = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.joanaEstampadosEBordados.getEstampadosEBordados.queryOptions()
  );

  // 👇 use the debounced value here
  const filteredData = useMemo(() => {
    if (!debouncedSearch.trim()) return data;
    const term = debouncedSearch.toLowerCase();
    return data.filter((item) => String(item.op).toLowerCase().includes(term));
  }, [data, debouncedSearch]);

  return (
    <>
      <header>
        <div className="flex flex-row ml-auto  items-center pb-1">
          <span className="ml-auto px-1">Op :</span>
          <Input
            placeholder="Pesquisar por op..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-44"
          />
        </div>
      </header>

      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="flex w-full flex-col items-center gap-1 overflow-auto">
            {JSON.stringify(filteredData, null, 2)}
          </div>
        </div>
      </main>
    </>
  );
};

export default EstampadosEBordados;
