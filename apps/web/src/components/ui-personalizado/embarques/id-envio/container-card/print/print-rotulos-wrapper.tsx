import {
  ContainerSchemaDto,
  ListaParaImprimrirDto,
} from "@repo/tipos/embarques_idenvio";
import React, { useRef } from "react";

import PrintRotulosConteudo from "./print-rotulos-conteudo";

import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";

type PrintRotulosWrapperProps = {
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
  container: ContainerSchemaDto;
  listaParaImprimrirDto: ListaParaImprimrirDto;
};

export default function PrintRotulosWrapper({
  contentRef,
  className,
  container,
  listaParaImprimrirDto,
}: PrintRotulosWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn(
        "aspect-[150/100] h-fit w-full overflow-y-auto bg-white text-black",
        className
      )}
      ref={containerRef}
    >
      <div
        className={cn("space-y-1 p-1", !width && "invisible")}
        style={{
          zoom: (1 / 578) * width,
        }}
        ref={contentRef}
        id="resumePreviewRotulosContent"
      >
        <PrintRotulosConteudo
          container={container}
          listaParaImprimrirDto={listaParaImprimrirDto}
        />
      </div>
    </div>
  );
}
//3h53.06
//https://www.unitconverters.net/typography-converter.html
//378
