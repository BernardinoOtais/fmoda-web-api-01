import { useSuspenseQuery } from "@repo/trpc";
import Link from "next/link";
import React, { Fragment } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb-modificada";
import { useTRPC } from "@/trpc/client";

type BreadCrumbsProps = {
  idEnvio: number;
  ultimoNivel: number;
};

const BreadCrumbs = ({ idEnvio, ultimoNivel }: BreadCrumbsProps) => {
  const trpc = useTRPC();

  const { data: crumbs } = useSuspenseQuery(
    trpc.embarquesIdEnvio.getSelectedContainers.queryOptions({
      id: idEnvio,
      idd: ultimoNivel,
    })
  );
  const caminho = `/dashboard/embarques/${idEnvio}`;

  const tamanhoDaLista = crumbs.length;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isDisabled = tamanhoDaLista - 1 === index;
          const isLast = tamanhoDaLista === index + 1;
          const naoELink = tamanhoDaLista != 1 && isDisabled;
          return (
            <Fragment key={crumb.id}>
              <BreadcrumbItem>
                {naoELink ? (
                  <BreadcrumbPage className="group relative">
                    <span>{`${crumb.nome} nº ${crumb.numero}`}</span>
                    <Badge className="absolute top-[-18px] right-[-20px] h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
                      {crumb.badge}
                    </Badge>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="group relative mr-2">
                    <Link
                      href={
                        index === 0 && crumbs.length === 1
                          ? { pathname: caminho ?? "/dashboard/embarques/novo" }
                          : {
                              pathname: caminho ?? "/dashboard/embarques/novo",
                              query: {
                                nivel: crumb.id,
                              },
                            }
                      }
                    >
                      <span>{`${crumb.nome} nº ${crumb.numero}`}</span>
                      <Badge className="absolute top-[-18px] right-[-20px] h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
                        {crumb.badge}
                      </Badge>
                      <Badge
                        variant="destructive"
                        className="absolute top-[-18px] right-[-20px] hidden h-5 w-5 items-center justify-center rounded-full text-xs font-bold group-hover:flex"
                      >
                        {"x"}
                      </Badge>
                      {/* Hover Badge */}
                    </Link>
                  </BreadcrumbLink>
                )}
                {!isLast && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbs;
