"use client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@repo/trpc";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import MalhaMobile from "./malha-mobile";
import MalhaWeb from "./malha-web";

import { Input } from "@/components/ui/input";
import SwitchFechado from "@/components/ui-personalizado/meus-components/switch-fechado";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

type EntradasMCMAConteudoProps = { veEscondidas: boolean };

const EntradasMCMAConteudo = ({ veEscondidas }: EntradasMCMAConteudoProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [searchOp, setSearchOp] = useState<string>("");
  const debouncedOp = useDebounce(searchOp, 1500);
  const opValue = debouncedOp.trim() === "" ? null : Number(debouncedOp);

  const { data } = useSuspenseQuery(
    trpc.joanaEntradasMcMa.getEntradasMcMa.queryOptions({
      op: opValue,
      veEscondidas,
    }),
  );
  const { mutate: escondeOuMostra } = useMutation(
    trpc.joanaEntradasMcMa.patchPostInsertEscondeBordadosEstampados.mutationOptions(
      {
        onMutate: async (valor) => {
          await queryClient.cancelQueries(
            trpc.joanaEntradasMcMa.getEntradasMcMa.queryOptions({
              op: opValue,
              veEscondidas,
            }),
          );
          const previousData = queryClient.getQueryData(
            trpc.joanaEntradasMcMa.getEntradasMcMa.queryKey({
              op: opValue,
              veEscondidas,
            }),
          );

          queryClient.setQueryData(
            trpc.joanaEntradasMcMa.getEntradasMcMa.queryKey({
              op: opValue,
              veEscondidas,
            }),
            (old) => {
              if (!old) return old;
              return old.filter((o) => o.bostamp !== valor.bostamp);
            },
          );
          return { previousData };
        },
        onSuccess: () => {
          toast.success(
            veEscondidas
              ? "Visível com sucesso..."
              : "Escondida com sucesso...",
          );
        },
        onError: (_error, _updatedEnvio, context) => {
          toast.error("Error...");
          if (
            context?.previousData &&
            trpc.joanaEntradasMcMa.getEntradasMcMa.queryKey({
              op: opValue,
              veEscondidas,
            })
          )
            queryClient.setQueryData(
              trpc.joanaEntradasMcMa.getEntradasMcMa.queryKey({
                op: opValue,
                veEscondidas,
              }),
              context.previousData,
            );
        },
      },
    ),
  );
  const [filtered, setFiltered] = useState(data);

  useEffect(() => {
    setFiltered(data);
  }, [data]);

  return (
    <>
      <header>
        <div className="flex flex-row   items-center p-1">
          <SwitchFechado
            titulo="Mostra Escondidos"
            fechado={veEscondidas}
            className="mx-auto"
            param="esc"
          />

          <div className="mx-auto flex flex-row items-center">
            <span className=" px-1">Op :</span>
            <Input
              placeholder="Pesquisar por op..."
              value={searchOp}
              onChange={(e) => setSearchOp(e.target.value)}
              className="w-44"
            />
          </div>
        </div>
      </header>

      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="flex w-full flex-col items-center gap-1 overflow-auto">
            <>
              {/* MOBILE / TABLET version (< lg) */}
              <div className="block lg:hidden w-full  flex-col">
                <MalhaMobile
                  dados={filtered}
                  escondeOuMostra={escondeOuMostra}
                  veEscondidas={veEscondidas}
                />
              </div>

              {/* DESKTOP version (>= lg) */}
              <div className="hidden w-full lg:block">
                <MalhaWeb
                  dados={filtered}
                  escondeOuMostra={escondeOuMostra}
                  veEscondidas={veEscondidas}
                />
              </div>
            </>
          </div>
        </div>
      </main>
    </>
  );
};

export default EntradasMCMAConteudo;
