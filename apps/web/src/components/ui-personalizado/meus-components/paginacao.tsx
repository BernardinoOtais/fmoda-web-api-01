import React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginacaoProps = {
  fechado?: boolean;
  paginaActual: number;
  totalPaginas: number;
  envpp: number;
};

const Paginacao = ({
  fechado,
  paginaActual,
  totalPaginas,
  envpp,
}: PaginacaoProps) => {
  const maxPage = Math.min(totalPaginas, Math.max(paginaActual + 4, 10));
  const minPage = Math.max(1, Math.min(paginaActual - 5, maxPage - 9));

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (fechado) params.set("fechado", "true");
    params.set("envpp", envpp.toString());
    return `?${params.toString()}`;
  };

  const renderPages = () => {
    const pages = [];
    for (let i = minPage; i <= maxPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink href={buildUrl(i)} isActive={i === paginaActual}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pages;
  };

  return (
    <>
      <div className="mx-auto hidden justify-between gap-3 lg:flex lg:flex-wrap">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {paginaActual > 1 && (
                <PaginationPrevious href={buildUrl(paginaActual - 1)} />
              )}
            </PaginationItem>
            {minPage > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink href={buildUrl(1)}>1</PaginationLink>
                </PaginationItem>
                {minPage > 2 && <PaginationEllipsis />}
              </>
            )}
            {renderPages()}
            {maxPage < totalPaginas && (
              <>
                {maxPage < totalPaginas - 1 && <PaginationEllipsis />}
                <PaginationItem>
                  <PaginationLink href={buildUrl(totalPaginas)}>
                    {totalPaginas}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              {paginaActual < totalPaginas && (
                <PaginationNext href={buildUrl(paginaActual + 1)} />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div className="mx-auto flex flex-wrap justify-between gap-3 lg:hidden">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {paginaActual != 1 && (
                <PaginationPrevious href={buildUrl(paginaActual - 1)} />
              )}
            </PaginationItem>
            {minPage > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink href={buildUrl(1)}>1</PaginationLink>
                </PaginationItem>
                {minPage > 2 && <PaginationEllipsis />}
              </>
            )}

            {renderPages()}

            {paginaActual != totalPaginas && (
              <>
                {paginaActual != totalPaginas && <PaginationEllipsis />}
                <PaginationItem>
                  <PaginationLink href={buildUrl(paginaActual)}>
                    {totalPaginas}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              {paginaActual != totalPaginas && (
                <PaginationNext href={buildUrl(paginaActual + 1)} />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default Paginacao;
