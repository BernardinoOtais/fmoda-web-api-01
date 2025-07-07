import {
  DestinoEnvioDto,
  ListaParaImprimrirDto,
} from "@repo/tipos/embarques_idenvio";
import React, { useRef } from "react";

import PrintPalletConteudo from "./print-pallet-conteudo";

import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";

type PrintPalletWrapperProps = {
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
  idEnvio: number;
  destino: DestinoEnvioDto;
  idContainer: number;
  listaParaImprimrirDto: ListaParaImprimrirDto;
};

export default function PrintPalletWrapper({
  contentRef,
  className,
  destino,
  idEnvio,
  idContainer,
  listaParaImprimrirDto,
}: PrintPalletWrapperProps) {
  console.log("idEnvio:", idEnvio, "idContainer:", idContainer);

  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full overflow-y-auto bg-white text-black",
        className
      )}
      ref={containerRef}
    >
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        <PrintPalletConteudo
          destino={destino}
          listaParaImprimrirDto={listaParaImprimrirDto}
        />
      </div>
    </div>
  );
}
